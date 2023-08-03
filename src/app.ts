import "reflect-metadata";
import express from "express";
import bodyparser from "body-parser";
import loggerMiddleware from "./middleware/logger.middleware";
import dataSource from "./db/postgres.db";
import employeeRoute from "./route/employee.route";

const server = express();
server.use(bodyparser.json());
server.use(loggerMiddleware);
server.use("/employees", employeeRoute);

server.get("/", (req, res) => {
  console.log(req.url);
  res.status(200).send("Hello there!");
});

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