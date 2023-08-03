import express, { NextFunction } from "express";
import EmployeeService from "../service/employee.service";
import { plainToInstance } from "class-transformer";
import { CreateEmployeeDto } from "../dto/create-employee.dto";
import { validate } from "class-validator";
import { HttpException } from "../exception/http.exception";
import { ValidateException } from "../exception/validate.exception";

class EmployeeController {
  public router: express.Router;

  constructor(private employeeService: EmployeeService) {
    this.router = express.Router();

    //API to handle fetching of all employees
    this.router.get("/", this.getAllEmployees); //one way to fix context issue - use this.getAllEmployees.bind(this); OR modify functions like getAllEmployees
    //to be member variables

    //API to handle fetching of specific employee by ID
    this.router.get("/:id", this.getEmployee);

    //API to handle creation of a new employee
    this.router.post("/", this.addEmployee);

    //API to handle modification of a specific employee by ID
    this.router.put("/:id", this.modifyEmployee);

    //API to handle deletion of a specific employee by ID
    this.router.delete("/:id", this.removeEmployee);
  }

  getAllEmployees = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const nameFilter = req.query.name;
      const employees = await this.employeeService.fetchAllEmployees(
        nameFilter as string
      );
      res.status(200).send(employees);
    } catch (err) {
      next(err);
    }
  };

  getEmployee = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const employeeId = Number(req.params.id);
      const employees = await this.employeeService.getEmployeeById(employeeId);
      res.status(200).send(employees);
    } catch (error) {
      next(error);
    }
  };

  addEmployee = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { name, email, address } = req.body;
      const createEmployeeDto = plainToInstance(CreateEmployeeDto, req.body);
      const errors = await validate(createEmployeeDto);
      if (errors.length > 0) {
        throw new ValidateException(400, "Validation Errors", errors);
      }
      const newEmployee = await this.employeeService.createEmployee(
        name,
        email,
        address
      );
      res.status(201).send(newEmployee);
    } catch (err) {
      next(err);
    }
  };

  modifyEmployee = async (
    req: express.Request,
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
      const employeeName = req.body.name;
      const employeeEmail = req.body.email;
      const employeeAddress = req.body.address;
      const modifiedEmployee = await this.employeeService.updateEmployee(
        employeeId,
        employeeName,
        employeeEmail,
        employeeAddress
      );
      res.status(200).send(modifiedEmployee);
    } catch (err) {
      next(err);
    }
  };

  removeEmployee = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const employeeId = Number(req.params.id);
      await this.employeeService.deleteEmployee(employeeId);
      res.status(204).send("Employee deleted");
    } catch (err) {
      next(err);
    }
  };
}

export default EmployeeController;
