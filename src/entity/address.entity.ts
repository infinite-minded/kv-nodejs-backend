import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import Employee from "./employee.entity";
import { AbstractEntity } from "./abstract-entity";

@Entity()
export class Address extends AbstractEntity {
  @Column()
  line1: string;

  @Column()
  pincode: string;

  @OneToOne(() => Employee, (employee) => employee.address)
  @JoinColumn() //owning side - this means that employee_id will be in address table and not the other way around for specifying one-to-one relation
  employee: Employee;
}
