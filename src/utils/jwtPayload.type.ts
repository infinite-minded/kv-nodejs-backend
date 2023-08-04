import { Role } from "./role.enum";

//THIS TYPE IS CREATED SO AS TO EXTRACT PAYLOAD DETAILS IN THE AUTHENTICATE MIDDLEWARE AND THEN INJECT IT INTO REQUEST
export type jwtPayload = {
  name: string;
  email: string;
  role: Role;
};
