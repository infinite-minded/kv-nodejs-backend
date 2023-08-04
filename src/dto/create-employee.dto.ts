import {
  IsNotEmpty,
  IsString,
  IsEmail,
  ValidateNested,
  IsNumber,
  IsObject,
  isObject,
  IsEnum,
} from "class-validator";
import { Type } from "class-transformer";
import { Address } from "../entity/address.entity";
import { CreateAddressDto } from "./create-address.dto";
import { Role } from "../utils/role.enum";

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
  address: Address;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
