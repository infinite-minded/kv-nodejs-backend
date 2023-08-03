import { DataSource, Like, Repository } from "typeorm";
import Employee from "../entity/employee.entity";
import dataSource from "../db/postgres.db";

class EmployeeRepository {
  private dataSource: DataSource;

  constructor(private employeeRepository: Repository<Employee>) {}

  findAllEmployees(filter: string): Promise<Employee[]> {
    return this.employeeRepository.find({
      where: {
        name: Like(filter),
      },
    });
  }

  findEmployeeById(id: number): Promise<Employee> {
    return this.employeeRepository.findOneBy({
      id: id,
    });
  }

  addNewEmployee(newEmployee: Employee): Promise<Employee> {
    return this.employeeRepository.save(newEmployee);
  }

  modifyEmployeeById(modifiedEmployee: Employee): Promise<Employee> {
    return this.employeeRepository.save(modifiedEmployee);
  }

  deleteEmployeeById(employeeToBeRemoved: Employee): Promise<Employee> {
    return this.employeeRepository.softRemove(employeeToBeRemoved);
  }
}

export default EmployeeRepository;
