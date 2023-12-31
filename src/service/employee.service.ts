import { Address } from "../entity/address.entity";
import Employee from "../entity/employee.entity";
import { HttpException } from "../exception/http.exception";
import EmployeeRepository from "../repository/employee.repository";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { Role } from "../utils/role.enum";
import { jwtPayload } from "../utils/jwtPayload.type";
import { Department } from "../entity/department-entity";
import { DepartmentService } from "../service/department.service";
import { CreateEmployeeDto } from "../dto/create-employee.dto";
import { UpdateEmployeeDto } from "../dto/update-employee.dto";

class EmployeeService {
  constructor(private employeeRepository: EmployeeRepository, private departmentService: DepartmentService) {}

  async fetchAllEmployees(nameFilter: string, skip: number, take: number): Promise<Employee[]> {
    //add additional business logic here if needed
    let filter: string;
    if (nameFilter) {
      filter = `%${nameFilter}%`;
    } else {
      filter = "%";
    }
    const employees = await this.employeeRepository.findAllEmployees(filter, skip, take);
    if (!employees) {
      throw new HttpException(404, `No employees added yet!`);
    }
    return employees;
  }

  async getEmployeeById(id: number): Promise<Employee | null> {
    //TO DO - business logic
    const employee = await this.employeeRepository.findEmployeeById(id);
    if (!employee) {
      throw new HttpException(404, `Employee with ID ${id} not found!`);
    }
    return employee;
  }

  async getEmployeeByEmail(email: string): Promise<Employee | null> {
    const employee = await this.employeeRepository.findByEmail(email);
    if (!employee) {
      throw new HttpException(404, `Employee with email ${email} not found!`);
    }
    return employee;
  }

  async createEmployee(
    employeeDto: CreateEmployeeDto
  ): Promise<Employee> {
    const newEmployee = new Employee();
    newEmployee.name = employeeDto.name;
    newEmployee.email = employeeDto.email;
    newEmployee.status = employeeDto.status;

    const newAddress = new Address();
    newAddress.line1 = employeeDto.address.line1;
    newAddress.line2 = employeeDto.address.line2;
    newAddress.pincode = employeeDto.address.pincode;

    newEmployee.address = newAddress; //OR newAddress.employee = newEmployee; - will this work & what other changes needed?

    newEmployee.password = await bcrypt.hash(employeeDto.password, 9);
    newEmployee.role = employeeDto.role;

    const assignedDepartment = await this.departmentService.getDepartmentById(employeeDto.department.id);

    newEmployee.department = assignedDepartment;

    return this.employeeRepository.addNewEmployee(newEmployee);
  }

  async updateEmployee(
    employeeDto: UpdateEmployeeDto
  ): Promise<Employee | null> {
    try {
      const employee = await this.getEmployeeById(employeeDto.id); //any invalid ID request exception will be thrown in getEmployeeById() itself
      employee.name = employeeDto.name;
      employee.email = employeeDto.email;
      employee.status = employeeDto.status;
      employee.address.line1 = employeeDto.address.line1;
      employee.address.line2 = employeeDto.address.line2;
      employee.address.pincode = employeeDto.address.pincode;
      employee.password = await bcrypt.hash(employeeDto.password, 9);
      employee.role = employeeDto.role;
      const newDepartment = await this.departmentService.getDepartmentById(employeeDto.department.id)
      employee.department = newDepartment;
      return this.employeeRepository.modifyEmployeeById(employee);
    } catch (error) {
      throw error;
    }
  }

  async deleteEmployee(id: number): Promise<void> {
    try {
      const employee = await this.getEmployeeById(id); //any invalid ID request exception will be thrown in getEmployeeById() itself
      await this.employeeRepository.deleteEmployeeById(employee);
    } catch (error) {
      throw error;
    }
  }

  loginEmployee = async (email: string, password: string) => {
    const employee = await this.employeeRepository.findByEmail(email);
    if (!employee) {
      throw new HttpException(401, "Incorrect email or password");
    }

    const passwordCorrect = await bcrypt.compare(password, employee.password);
    if (!passwordCorrect) {
      throw new HttpException(401, "Incorrect email or password");
    }

    const payload: jwtPayload = {
      name: employee.name,
      email: employee.email,
      role: employee.role,
    };

    const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    }); //60 enn mathram koduthal it is 60ms, also algo can be set in 3rd arg of sign()
    return token;
  };
}

export default EmployeeService;
