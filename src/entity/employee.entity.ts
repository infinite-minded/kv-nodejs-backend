import { Entity, Column, OneToOne } from "typeorm";
import { Address } from "./address.entity";
import { AbstractEntity } from "./abstract-entity";
import { Role } from "../utils/role.enum";

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

  @Column({ nullable: true })
  age: number;

  @OneToOne(() => Address, (address) => address.employee, {
    cascade: true,
  })
  address: Address;

  @Column()
  password: string;

  @Column({ default: Role.DEVELOPER })
  role: Role;
}

export default Employee;
