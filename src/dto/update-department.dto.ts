import { IsNumber, IsString, IsNotEmpty } from "class-validator";

export class UpdateDepartmentDto {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;
}
