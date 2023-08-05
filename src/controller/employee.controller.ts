import express from "express";
import EmployeeService from "../service/employee.service";
import { plainToInstance } from "class-transformer";
import { CreateEmployeeDto } from "../dto/create-employee.dto";
import { validate } from "class-validator";
import { ValidateException } from "../exception/validate.exception";
import { authenticate } from "../middleware/authenticate.middleware";
import { authorize } from "../middleware/authorize.middleware";
import { FormatResponse } from "../utils/formatResponse";
import { RequestWithUser } from "../utils/requestWithUser";
import { Role } from "../utils/role.enum";

class EmployeeController {
  public router: express.Router;

  constructor(private employeeService: EmployeeService) {
    this.router = express.Router();

    //API to handle fetching of all employees
    this.router.get("/", authenticate, this.getAllEmployees); //middleware chaining - router + authenticate
    //this.router.get("/", this.getAllEmployees); - one way to fix context issue - use this.getAllEmployees.bind(this); OR modify functions like getAllEmployees
    //to be member variables

    //API to handle fetching of specific employee by ID
    this.router.get("/:id", authenticate, this.getEmployee);

    //API to handle creation of a new employee
    this.router.post(
      "/",
      authenticate,
      authorize([Role.HR, Role.ADMIN]),
      this.addEmployee
    );

    //API to handle modification of a specific employee by ID
    this.router.put(
      "/:id",
      authenticate,
      authorize([Role.HR, Role.ADMIN]),
      this.modifyEmployee
    );

    //API to handle deletion of a specific employee by ID
    this.router.delete(
      "/:id",
      authenticate,
      authorize([Role.HR, Role.ADMIN]),
      this.removeEmployee
    );

    //API to handle login auth
    this.router.post("/login", this.loginEmployee);
  }

  public getAllEmployees = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const nameFilter = req.query.name;
      const employees = await this.employeeService.fetchAllEmployees(
        nameFilter as string
      );
      res
        .status(200)
        .send(
          FormatResponse.format(employees, Date.now() - req.initTime, "OK")
        );
    } catch (err) {
      next(err);
    }
  };

  public getEmployee = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const employeeId = Number(req.params.id);
      const employees = await this.employeeService.getEmployeeById(employeeId);
      res
        .status(200)
        .send(
          FormatResponse.format(employees, Date.now() - req.initTime, "OK")
        );
    } catch (error) {
      next(error);
    }
  };

  public addEmployee = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      //const { name, email, address } = req.body;
      const createEmployeeDto = plainToInstance(CreateEmployeeDto, req.body);
      const errors = await validate(createEmployeeDto);
      if (errors.length > 0) {
        throw new ValidateException(400, "Validation Errors", errors);
      }
      const newEmployee = await this.employeeService.createEmployee(
        createEmployeeDto.name, //pass validated DTO attribs here instead of name, email, etc
        createEmployeeDto.email,
        createEmployeeDto.address,
        createEmployeeDto.password,
        createEmployeeDto.role
      );
      res
        .status(201)
        .send(
          FormatResponse.format(newEmployee, Date.now() - req.initTime, "OK")
        );
    } catch (err) {
      next(err);
    }
  };

  public modifyEmployee = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const modifyEmployeeDto = plainToInstance(CreateEmployeeDto, req.body);
      const errors = await validate(modifyEmployeeDto);
      if (errors.length > 0) {
        throw new ValidateException(400, "Validation Errors", errors);
      }
      const employeeId = Number(req.params.id);
      /*
      const employeeName = req.body.name;
      const employeeEmail = req.body.email;
      const employeeAddress = req.body.address;
      */
      const modifiedEmployee = await this.employeeService.updateEmployee(
        employeeId,
        modifyEmployeeDto.name,
        modifyEmployeeDto.email,
        modifyEmployeeDto.address,
        modifyEmployeeDto.password
      );
      res
        .status(200)
        .send(
          FormatResponse.format(
            modifiedEmployee,
            Date.now() - req.initTime,
            "OK"
          )
        );
    } catch (err) {
      next(err);
    }
  };

  public removeEmployee = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const employeeId = Number(req.params.id);
      await this.employeeService.deleteEmployee(employeeId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };

  public loginEmployee = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { email, password } = req.body;
    try {
      const token = await this.employeeService.loginEmployee(email, password);
      const employeeDetails = await this.employeeService.getEmployeeByEmail(
        email
      );
      const data = { token: token, employeeDetails: employeeDetails };
      res
        .status(201)
        .send(FormatResponse.format(data, Date.now() - req.initTime, "OK")); //this kind of structure is expected while using send()
    } catch (err) {
      next(err);
    }
  };
}

export default EmployeeController;
