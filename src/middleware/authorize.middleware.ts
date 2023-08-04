import { NextFunction, Response } from "express";
import { RequestWithUser } from "../utils/requestWithUser";
import { Role } from "../utils/role.enum";
import { HttpException } from "../exception/http.exception";

export const authorize = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const role: Role = req.role;
    if (role !== Role.HR) {
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

/*
export const authorize = (...roles: Role[]) => {
    return async (
        req: RequestWithUser,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const role: Role = req.role;
          if (role === Role.HR) {
            // throw new HttpException(
            //   403,
            //   "You are not authorized to perform this action."
            // );
          }
          if (role === Role.DEVELOPER) {
            if (req.params.id === req.payload.id)
          }
          next();
        } catch (error) {
          next(error);
        }
      }
}
*/