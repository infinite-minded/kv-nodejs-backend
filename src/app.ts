import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });
import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import bodyparser from "body-parser";
import loggerMiddleware from "./middleware/logger.middleware";
import dataSource from "./db/postgres.db";
import employeeRoute from "./route/employee.route";
import departmentRoute from "./route/department.route";
import roleRoute from "./route/role.route";
import { errorMiddleware } from "./middleware/error.middleware";
import { RequestWithUser } from "./utils/requestWithUser";

const server = express();
server.use(bodyparser.json());
server.use(loggerMiddleware);
server.use(
  (request: RequestWithUser, response: Response, next: NextFunction) => {
    request.initTime = Date.now();
    next();
  }
);
server.use("/employees", employeeRoute);
server.use("/departments", departmentRoute);
server.use("/roles", roleRoute);

//ERROR MIDDLEWARE - CUSTOM ONE (Express has a default error handler)
server.use(errorMiddleware);

(async () => {
  await dataSource.initialize();
  server.listen(3001, () => {
    console.log("Server listening to port 3001");
  });
})();
/*
the above is same as
const someFn = async() => {body};
someFn();
*/
