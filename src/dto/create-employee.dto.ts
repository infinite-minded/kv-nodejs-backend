import { IsNotEmpty, IsString, IsEmail, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Address } from "../entity/address.entity";
import { CreateAddressDto } from "./create-address.dto";

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @ValidateNested({ each: true }) //to validate inner keys of address object
  @Type(() => CreateAddressDto)
  address: Address;
}
