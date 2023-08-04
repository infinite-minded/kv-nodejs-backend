import { Request } from "express";
import { Role } from "./role.enum";

//THIS INTERFACE IS TO REPLACE THE REQUEST IN AUTHENTICATE MIDDLEWARE
export interface RequestWithUser extends Request {
  name: string;
  email: string;
  role: Role;
}
