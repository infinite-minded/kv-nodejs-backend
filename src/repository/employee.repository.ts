import { DataSource, Like, Repository } from "typeorm";
import Employee from "../entity/employee.entity";

class EmployeeRepository {
  private dataSource: DataSource;

  constructor(private employeeRepository: Repository<Employee>) {}

  findAllEmployees(filter: string): Promise<Employee[]> {
    return this.employeeRepository.find({
      where: {
        name: Like(filter),
      },
      relations: {
        address: true,
      },
    });
  }

  findEmployeeById(id: number): Promise<Employee> {
    return this.employeeRepository.findOne({
      where: { id: id },
      relations: {
        address: true,
        //add other properties here to perform join with other tables
      },
    });
  }

  findByEmail(email: string): Promise<Employee> {
    return this.employeeRepository.findOne({
      where: { email: email },
      relations: {
        address: true,
        //add other properties here to perform join with other tables
      },
    });
  }

  addNewEmployee(newEmployee: Employee): Promise<Employee> {
    return this.employeeRepository.save(newEmployee);
  }

  modifyEmployeeById(updatedEmployee: Employee): Promise<Employee> {
    return this.employeeRepository.save(updatedEmployee);
  }

  deleteEmployeeById(employeeToBeRemoved: Employee): Promise<Employee> {
    return this.employeeRepository.softRemove(employeeToBeRemoved);
  }
}

export default EmployeeRepository;
