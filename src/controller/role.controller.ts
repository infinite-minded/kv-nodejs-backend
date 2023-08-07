import express, { Response, NextFunction } from "express";
import { RequestWithUser } from "../utils/requestWithUser";
import { RoleService } from "../service/role.service";
import { FormatResponse } from "../utils/formatResponse";
import { logger } from "../middleware/winston.middleware";
import { authenticate } from "../middleware/authenticate.middleware";

export class RoleController {
  public router: express.Router;

  constructor(private roleService: RoleService) {
    this.router = express.Router();
    this.router.get("/", authenticate, this.getAllRoles);
  }

  public getAllRoles = (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    const roles = Object.assign({}, this.roleService.fetchAllRoles());
    res
      .status(200)
      .send(FormatResponse.format(roles, Date.now() - req.initTime, "OK"));
    logger.log("info", "Fetched all roles");
  };
}
