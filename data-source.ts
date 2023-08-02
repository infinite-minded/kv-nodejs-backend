import { DataSource } from "typeorm";
import Employee from "./employee";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 8765,
  username: "postgres",
  password: "postgres",
  database: "training",
  logging: true,
  entities: [Employee],
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: true //only set during dev phase to make quick features, here we are using for deletedAt column
});

export default dataSource;