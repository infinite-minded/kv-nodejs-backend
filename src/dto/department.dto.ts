import { IsNumber, IsNotEmpty } from "class-validator";

export class DepartmentDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
