import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });
import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import bodyparser from "body-parser";
import loggerMiddleware from "./middleware/logger.middleware";
import dataSource from "./db/postgres.db";
import employeeRoute from "./route/employee.route";
import { errorMiddleware } from "./middleware/error.middleware";

const server = express();
server.use(bodyparser.json());
server.use(loggerMiddleware);
server.use("/employees", employeeRoute);

server.get("/", (req, res) => {
  console.log(req.url);
  res.status(200).send("Hello there!");
});

//ERROR MIDDLEWARE - CUSTOM ONE (Express has a default error handler)
server.use(errorMiddleware);

(async () => {
  await dataSource.initialize();
  server.listen(3000, () => {
    console.log("Server listening to port 3000");
  });
})();
/*
the above is same as
const someFn = async() => {body};
someFn();
*/
