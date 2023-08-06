import { IsString, IsNotEmpty } from "class-validator";

export class CreateDepartmentDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
