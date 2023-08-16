import express, { NextFunction } from "express";
import { DepartmentService } from "../service/department.service";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ValidateException } from "../exception/validate.exception";
import { authenticate } from "../middleware/authenticate.middleware";
import { authorize } from "../middleware/authorize.middleware";
import { RequestWithUser } from "../utils/requestWithUser";
import { FormatResponse } from "../utils/formatResponse";
import { Role } from "../utils/role.enum";
import { CreateDepartmentDto} from "../dto/create-department.dto";
import { logger } from "../middleware/winston.middleware";
import { DepartmentDto } from "../dto/department.dto";
import { UpdateDepartmentDto } from "../dto/update-department-dto";

class DepartmentController {
  public router: express.Router;

  constructor(private departmentService: DepartmentService) {
    this.router = express.Router();
    this.router.get("/", authenticate, this.getAllDepartments);
    this.router.get("/:id", authenticate, this.getDepartment);
    this.router.post(
      "/",
      authenticate,
      authorize([Role.HR, Role.ADMIN]),
      this.addDepartment
    );
    this.router.put(
      "/:id",
      authenticate,
      authorize([Role.HR, Role.ADMIN]),
      this.modifyDepartment
    );
    this.router.delete(
      "/:id",
      authenticate,
      authorize([Role.HR, Role.ADMIN]),
      this.removeDepartment
    );
  }

  public getAllDepartments = async (
    req: RequestWithUser,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const departments = await this.departmentService.fetchAllDepartments();
      res
        .status(200)
        .send(
          FormatResponse.format(departments, Date.now() - req.initTime, "OK")
        );
      logger.log("info", "Fetched all departments");
    } catch (error) {
      next(error);
    }
  };

  public getDepartment = async (
    req: RequestWithUser,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const departments = await this.departmentService.getDepartmentById(
        Number(req.params.id)
      );
      res
        .status(200)
        .send(
          FormatResponse.format(departments, Date.now() - req.initTime, "OK")
        );
      logger.log("info", `Department with ID ${req.params.id} fetched`);
    } catch (error) {
      next(error);
    }
  };

  public addDepartment = async (
    req: RequestWithUser,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const createDepartmentDto = plainToInstance(
        CreateDepartmentDto,
        req.body
      );
      const errors = await validate(createDepartmentDto);
      if (errors.length > 0) {
        throw new ValidateException(400, "Validation Errors", errors);
      }
      const newDepartment = await this.departmentService.createDepartment(
        createDepartmentDto
      );
      res
        .status(201)
        .send(
          FormatResponse.format(newDepartment, Date.now() - req.initTime, "OK")
        );
      logger.log("info", "New department created");
    } catch (error) {
      next(error);
    }
  };

  public modifyDepartment = async (
    req: RequestWithUser,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const updateDepartmentDto = plainToInstance(
        UpdateDepartmentDto,
        req.body
      );
      updateDepartmentDto.id = Number(req.params.id);
      const errors = await validate(updateDepartmentDto);
      if (errors.length > 0) {
        throw new ValidateException(400, "Validation Errors", errors);
      }

      const updatedDepartment = await this.departmentService.updateDepartment(
        updateDepartmentDto
      );
      res
        .status(200)
        .send(
          FormatResponse.format(
            updatedDepartment,
            Date.now() - req.initTime,
            "OK"
          )
        );
      logger.log("info", `Department with ID ${req.params.id} updated`);
    } catch (error) {
      next(error);
    }
  };

  removeDepartment = async (
    req: RequestWithUser,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const deleteDepartment = await this.departmentService.deleteDepartment(
        Number(req.params.id)
      );
      res.status(204).send();
      logger.log("info", `Department with ID ${req.params.id} removed`);
    } catch (error) {
      next(error);
    }
  };
}

export default DepartmentController;
