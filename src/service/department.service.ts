import { Department } from "../entity/department-entity";
import { HttpException } from "../exception/http.exception";
import { DepartmentRepository } from "../repository/department.repository";

export class DepartmentService {
  constructor(private departmentRepository: DepartmentRepository) {}

  async fetchAllDepartments(): Promise<Department[]> {
    const departments = await this.departmentRepository.findAllDepartments();
    if (!departments) {
      throw new HttpException(404, `No departments added yet!`);
    }
    return departments;
  }

  async getDepartmentById(id: number): Promise<Department | null> {
    const department = await this.departmentRepository.findDepartmentById(id);
    if (!department) {
      throw new HttpException(404, `Department with ID ${id} not found!`);
    }
    return department;
  }

  async createDepartment(name: string): Promise<Department> {
    const newDepartment = new Department();
    newDepartment.name = name;
    newDepartment.employees = [];
    return this.departmentRepository.addNewDepartment(newDepartment);
  }

  async updateDepartment(id: number, name: string): Promise<Department> {
    try {
      const department = await this.getDepartmentById(id);
      department.name = name;
      return this.departmentRepository.modifyDepartmentById(department);
    } catch (error) {
      throw error;
    }
  }

  async deleteDepartment(id: number): Promise<void> {
    try {
      const department = await this.getDepartmentById(id);
      if (!department) {
        throw new HttpException(404, `Department with ID ${id} not found!`);
      }
      await this.departmentRepository.deleteDepartmentById(department);
    } catch (error) {
      throw error;
    }
  }
}
