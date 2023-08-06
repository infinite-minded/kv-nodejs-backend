import { AbstractEntity } from "./abstract-entity";
import Employee from "./employee.entity";
import { Entity, Column, OneToMany } from "typeorm";

@Entity("departments")
export class Department extends AbstractEntity {
  @Column()
  name: string;

  @OneToMany(() => Employee, (employee) => employee.departmentId, {
    cascade: true,
  })
  employees: Employee[];
}
