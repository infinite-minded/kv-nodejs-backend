import { IsNumber, IsString, IsNotEmpty } from "class-validator";

export class UpdateDepartmentDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;
}
