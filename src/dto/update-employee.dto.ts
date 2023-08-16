import {
  IsNotEmpty,
  IsString,
  IsEmail,
  ValidateNested,
  IsObject,
  IsEnum,
  IsNumber,
  IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";
import { CreateAddressDto } from "./create-address.dto";
import { Role } from "../utils/role.enum";
import { DepartmentDto } from "./department.dto";

export class UpdateEmployeeDto {
  @IsNumber()
  id: number;

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
