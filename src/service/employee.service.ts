import { Address } from "../entity/address.entity";
import Employee from "../entity/employee.entity";
import { HttpException } from "../exception/http.exception";
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

  async getEmployeeById(id: number): Promise<Employee | null> {
    //TO DO - business logic
    const employee = await this.employeeRepository.findEmployeeById(id);
    if (!employee) {
      throw new HttpException(404, `Employee with ID ${id} not found!`);
    }
    return employee;
  }

  createEmployee(name: string, email: string, address: any): Promise<Employee> {
    const newEmployee = new Employee();
    newEmployee.name = name;
    newEmployee.email = email;

    const newAddress = new Address();
    newAddress.line1 = address.line1;
    newAddress.pincode = address.pincode;

    newEmployee.address = newAddress; //OR newAddress.employee = newEmployee; - will this work & what other changes needed?

    return this.employeeRepository.addNewEmployee(newEmployee);
  }

  async updateEmployee(
    id: number,
    name: string,
    email: string,
    address: Address
  ): Promise<Employee | null> {
    const employee = await this.getEmployeeById(id);
    employee.name = name;
    employee.email = email;
    employee.address.line1 = address.line1;
    employee.address.pincode = address.pincode;
    return this.employeeRepository.modifyEmployeeById(employee);
  }

  async deleteEmployee(id: number): Promise<void> {
    const employee = await this.getEmployeeById(id);
    await this.employeeRepository.deleteEmployeeById(employee);
  }
}

export default EmployeeService;
