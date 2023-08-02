import express from "express";
import Employee from "./employee";

const employeeRouter = express.Router();
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

employeeRouter.get("/", (req, res) => {
  console.log(req.url);
  res.status(200).send(employees);
});

employeeRouter.get("/:id", (req, res) => {
  console.log(req.url);
  /*
  const id: number = Number(req.params.id);
  const emp = employees.find((employee)=> {
    return employee.id === id;
  })
  */
  const employee = employees.find((emp) => emp.id === Number(req.params.id));
  res.status(200).send(employee);
});

employeeRouter.post("/", (req, res) => {
  console.log(req.url);
  const newEmployee = new Employee();
  newEmployee.id = ++count;
  newEmployee.name = req.body.name;
  newEmployee.email = req.body.email;
  newEmployee.createdAt = new Date();
  newEmployee.updatedAt = new Date();
  employees.push(newEmployee);
  res.status(201).send(newEmployee);
});

employeeRouter.put("/:id", (req, res) => {
  console.log(req.url);
  const employee = employees.find((emp) => emp.id === Number(req.params.id));
  employee.name = req.body.name;
  employee.email = req.body.email;
  employee.updatedAt = new Date();
  res.status(200).send(employee);
});

// employeeRouter.patch("/:id", (req, res) => {
//   console.log(req.url);
//   res.status(200).send("Sample");
// });

employeeRouter.delete("/:id", (req, res) => {
  console.log(req.url);
  const employeeIndex = employees.findIndex((emp) => emp.id === Number(req.params.id));
  employees.splice(employeeIndex, 1);
  res.status(204).send();
});

export default employeeRouter;
//OR to export two or more objects, use export { employeeRouter, <another object> }; & then import {employeeRouter} in other file
