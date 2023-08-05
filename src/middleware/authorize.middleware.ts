import { NextFunction, Response } from "express";
import { RequestWithUser } from "../utils/requestWithUser";
import { Role } from "../utils/role.enum";
import { HttpException } from "../exception/http.exception";

export const authorize = (roles: Role[]) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const role: Role = req.role;
      if (!roles.includes(role)) {
        throw new HttpException(
          403,
          "You are not authorized to perform this action."
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
