import {
  IsNotEmpty,
  IsString,
  IsEmail,
  ValidateNested,
  IsObject,
  IsEnum,
  IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";
import { Address } from "../entity/address.entity";
import { CreateAddressDto } from "./create-address.dto";
import { Role } from "../utils/role.enum";
import { DepartmentDto } from "./department.dto";

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsBoolean()
  status: boolean;

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
  @Type(() => DepartmentDto)
  department: DepartmentDto;
}
