import express from "express";
import { HttpException } from "../exception/http.exception";
import { ValidateException } from "../exception/validate.exception";

export const errorMiddleware = (
  error: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    console.error(error.stack);
    if (error instanceof ValidateException) {
      res.status(error.status).send({
        message: error.message,
        errors: error.exceptionList,
      });
    } else if (error instanceof HttpException) {
      res.status(error.status).send({ error: error.message });
      return;
    } else {
      res.status(500).send({ error: error.message });
    }
  } catch (err) {
    //catch block is used to handle other errors that we may not be aware of
    //such errors are then handled by default error handler of express
    next(err);
  }
};
