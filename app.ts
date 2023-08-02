import "reflect-metadata";
import express from "express";
import loggerMiddleware from "./loggerMiddleware";
import employeeRouter from "./employee_router";
import dataSource from "./data-source";

const server = express();

server.use(express.json());
server.use(loggerMiddleware);
server.use("/employees", employeeRouter);

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