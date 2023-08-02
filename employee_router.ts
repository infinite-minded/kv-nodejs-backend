import express from "express";
import Employee from "./employee";
//import { Client } from "pg";
import { DataSource, Like } from "typeorm";
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
  const nameFilter = req.query.name;
  const employeeRepository = dataSource.getRepository(Employee);

  const employee = await employeeRepository.find({
    where: {
      name: Like((("%" + nameFilter) as string) + "%"), //just like regex
      //,email: Like("%@gmail.com"),.. - this way, you can add more filters in where condition of find()
    },
  });

  /*
  OR
  --show results with filter if exists or show all--

  const filters: FindOptionsWhere<Employee> = {};
  if (nameFilter) {
    filters.name = Like(`${nameFilter}%`);
  }

  const employees = await employeeRepository.find({ where: filters });
  also refer query builder on typeorm.io to create complex queries

  ------FOR MULTIPLE FILTERS------
  const qb = employeeRepository.createQueryBuilder(); - FIRST CREATE QB
  - SPECIFY REQUIRED CONDITIONS FOR QUERY
  if (nameFilter)
    { qb.andWhere("name LIKE :somename", { somename: `%${nameFilter}%` }); } - this can be used with nameFilter
  if (emailFilter)
    { qb.andWhere("email LIKE :email", { email: `%${emailFilter}%` }); } - this can be used with const emailFilter = req.query.email;
  const employees = await qb.getMany(); - THEN EXECUTE USING getMany()
  */

  res.status(200).send(employee);
});

employeeRouter.get("/:id", async (req, res) => {
  console.log(req.url); //USE req.baseUrl + req.url to get full path
  const employeeRepository = dataSource.getRepository(Employee); // repository is a layer which converts domain model to DB object
  const employee = await employeeRepository.findOneBy({
    id: Number(req.params.id),
  });
  if (employee) {
    res.status(200).send(employee);
  } else {
    res.status(404).send();
  }

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
  const employee = await employeeRepository.findOneBy({
    id: Number(req.params.id),
  });
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
  const employee = await employeeRepository.findOneBy({
    id: Number(req.params.id),
  });
  //await employeeRepository.remove(employee); - THIS IS HARD DELETE
  await employeeRepository.softRemove(employee);
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
