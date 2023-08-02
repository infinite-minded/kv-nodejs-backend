import { NextFunction, Request, Response } from "express";

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date()}:${req.url}:${req.method}`);
  next(); //if this is not specified, next middleware won't be called
};

export default loggerMiddleware;