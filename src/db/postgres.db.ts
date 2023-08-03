import { DataSource } from "typeorm";
import Employee from "../entity/employee.entity";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 8765,
  username: "postgres",
  password: "postgres",
  database: "training",
  logging: true, //to see underlying queries in console
  entities: [Employee],
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: true //destructive - understand why? - only set during dev phase to make quick features, here we are using for deletedAt column,
  //never use in production
});

export default dataSource;