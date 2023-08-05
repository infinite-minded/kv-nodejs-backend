import express from "express";
import { HttpException } from "../exception/http.exception";
import { ValidateException } from "../exception/validate.exception";
import { FormatResponse } from "../utils/formatResponse";
import { RequestWithUser } from "../utils/requestWithUser";

export const errorMiddleware = (
  error: Error,
  req: RequestWithUser,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    console.error(error.stack);
    if (error instanceof ValidateException) {
      res
        .status(error.status)
        .send(
          FormatResponse.format(
            error,
            Date.now() - req.initTime,
            error.message
          )
        );
    } else if (error instanceof HttpException) {
      res
        .status(error.status)
        .send(
          FormatResponse.format(error, Date.now() - req.initTime, error.message)
        );
      return;
    } else {
      res
        .status(500)
        .send(
          FormatResponse.format(null, Date.now() - req.initTime, error.message)
        );
    }
  } catch (err) {
    //catch block is used to handle other errors that we may not be aware of
    //such errors are then handled by default error handler of express
    next(err);
  }
};
