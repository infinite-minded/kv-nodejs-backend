import Employee from "../entity/employee.entity";
import EmployeeRepository from "../repository/employee.repository";

class EmployeeService {
  constructor(private employeeRepository: EmployeeRepository) {}

  fetchAllEmployees(nameFilter: string): Promise<Employee[]> {
    //add additional business logic here if needed
    let filter: string;
    if (nameFilter) {
      filter = `%${nameFilter}%`;
    } else {
      filter = "%";
    }
    return this.employeeRepository.findAllEmployees(filter);
  }

  getEmployeeById(id: number): Promise<Employee | null> {
    //TO DO - business logic
    return this.employeeRepository.findEmployeeById(id);
  }

  createEmployee(name: string, email: string): Promise<Employee> {
    const newEmployee = new Employee();
    newEmployee.name = name;
    newEmployee.email = email;
    return this.employeeRepository.addNewEmployee(newEmployee);
  }

  async updateEmployee(
    id: number,
    name: string,
    email: string
  ): Promise<Employee | null> {
    const employee = await this.getEmployeeById(id);
    employee.name = name;
    employee.email = email;
    return this.employeeRepository.modifyEmployeeById(employee);
  }

  async deleteEmployee(id: number): Promise<void> {
    const employee = await this.getEmployeeById(id);
    await this.employeeRepository.deleteEmployeeById(employee);
  }
}

export default EmployeeService;
