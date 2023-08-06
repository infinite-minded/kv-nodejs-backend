import { Entity, Column, OneToOne, ManyToOne, JoinColumn } from "typeorm";
import { Address } from "./address.entity";
import { AbstractEntity } from "./abstract-entity";
import { Role } from "../utils/role.enum";
import { Department } from "./department-entity";

@Entity("employees")
class Employee extends AbstractEntity {
  //refer https://typeorm.io/ for setup documentation
  @Column()
  name: string;

  @Column()
  email: string;
  //these are extra fields not part of table but can be added as columns in ORM
  //firstName: string;
  //lastName: string;

  @Column()
  password: string;

  @Column({ default: Role.DEVELOPER })
  role: Role;

  @OneToOne(() => Address, (address) => address.employee, {
    cascade: true,
  })
  address: Address;

  @ManyToOne(() => Department, (department) => department.id, {
    nullable: true,
  })
  @JoinColumn()
  departmentId: number;
}

export default Employee;
