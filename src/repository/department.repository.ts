import { Repository } from "typeorm";
import { Department } from "../entity/department-entity";

export class DepartmentRepository {
  constructor(private departmentRepository: Repository<Department>) {}

  findAllDepartments(): Promise<Department[]> {
    return this.departmentRepository.find({});
  }

  findDepartmentById(id: number): Promise<Department | null> {
    return this.departmentRepository.findOne({
      where: { id: id },
    });
  }

  addNewDepartment(newDepartment: Department): Promise<Department> {
    return this.departmentRepository.save(newDepartment);
  }

  modifyDepartmentById(updatedDepartment: Department): Promise<Department> {
    return this.departmentRepository.save(updatedDepartment);
  }

  deleteDepartmentById(departmentToBeRemoved: Department): Promise<Department> {
    return this.departmentRepository.softRemove(departmentToBeRemoved);
  }
}
