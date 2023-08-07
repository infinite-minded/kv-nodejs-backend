import {
  IsNotEmpty,
  IsString,
  IsEmail,
  ValidateNested,
  IsObject,
  IsEnum,
} from "class-validator";
import { Type } from "class-transformer";
import { Address } from "../entity/address.entity";
import { CreateAddressDto } from "./create-address.dto";
import { Role } from "../utils/role.enum";
import { CreateDepartmentDto } from "./create-department.dto";
import { Department } from "../entity/department-entity";

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested({ each: true }) //to validate inner keys of address object
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested({ each: true }) //to validate inner keys of address object
  @Type(() => CreateDepartmentDto)
  department: CreateDepartmentDto;
}
