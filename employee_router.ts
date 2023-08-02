import express from "express";
import Employee from "./employee";
//import { Client } from "pg";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import dataSource from "./data-source";

const employeeRouter = express.Router();
/*
let count = 2;
const employees: Employee[] = [
  {
    id: 1,
    name: "A",
    email: "A@gmail.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "B",
    email: "B@gmail.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
*/

employeeRouter.get("/", async (req, res) => {
  console.log(req.url);
  //console.log(new Date().toString());
  const employeeRepository = dataSource.getRepository(Employee);
  const employee = await employeeRepository.find();
  res.status(200).send(employee);
});

employeeRouter.get("/:id", async (req, res) => {
  console.log(req.url); //USE req.baseUrl + req.url to get full path
  const employeeRepository = dataSource.getRepository(Employee);// repository is a layer which converts domain model to DB object
  const employee = await employeeRepository.findOneBy({id: Number(req.params.id)});
  res.status(200).send(employee);

  // refer https://node-postgres.com/ for postgresql client docmntn
  /*
  const id: number = Number(req.params.id);
  const emp = employees.find((employee)=> {
    return employee.id === id;
  })
  */
  /* - normal code when not using ORM for DB requests
  const client = new Client({
    host: "localhost",
    port: 8765,
    database: "training",
    user: "postgres",
    password: "postgres",
  });
  await client.connect();
  */

  /* - normally needed when using pg module if ORM not used
  const result = await client.query("SELECT * FROM employees WHERE id = $1", [
    req.params.id,
  ]);
  const rawEmployee = result.rows[0];
  const employee = new Employee();
  employee.id = rawEmployee.id;
  employee.name = rawEmployee.name;
  employee.email = rawEmployee.email;
  employee.createdAt = rawEmployee.created_at;
  employee.updatedAt = rawEmployee.updated_at;
  const employee = result.rows[0];
  await client.end();
  */
  //const employee = employees.find((emp) => emp.id === Number(req.params.id));
});

employeeRouter.post("/", async (req, res) => {
  console.log(req.url);
  const newEmployee = new Employee();
  newEmployee.name = req.body.name;
  newEmployee.email = req.body.email;

  const employeeRepository = dataSource.getRepository(Employee);
  const savedEmployee = await employeeRepository.save(newEmployee);

  res.status(201).send(savedEmployee);
});

employeeRouter.put("/:id", async (req, res) => {
  console.log(req.url);
  const employeeRepository = dataSource.getRepository(Employee);
  const employee = await employeeRepository.findOneBy({id: Number(req.params.id)});
  employee.name = req.body.name;
  employee.email = req.body.email;
  const savedEmployee = await employeeRepository.save(employee);
  res.status(200).send(savedEmployee);
  /*
  const employee = employees.find((emp) => emp.id === Number(req.params.id));
  employee.name = req.body.name;
  employee.email = req.body.email;
  employee.updatedAt = new Date();
  */
});

employeeRouter.delete("/:id", async (req, res) => {
  console.log(req.url);
  const employeeRepository = dataSource.getRepository(Employee);
  const employee = await employeeRepository.findOneBy({id: Number(req.params.id)});
  await employeeRepository.remove(employee);
  res.status(204).send();
  /*
  const employeeIndex = employees.findIndex(
    (emp) => emp.id === Number(req.params.id)
  );
  employees.splice(employeeIndex, 1);
  */
  
});

export default employeeRouter;
//OR to export two or more objects, use export { employeeRouter, <another object> }; & then import {employeeRouter} in other file
