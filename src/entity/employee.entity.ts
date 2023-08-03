import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
} from "typeorm";
import { Address } from "./address.entity";

@Entity("employees")
class Employee {
  //refer https://typeorm.io/ for setup documentation
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;
  //these are extra fields not part of table but can be added as columns in ORM
  //firstName: string;
  //lastName: string;

  @Column({ nullable: true })
  age: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => Address, (address) => address.employee, {
    cascade: true,
  })
  address: Address;
}

export default Employee;
