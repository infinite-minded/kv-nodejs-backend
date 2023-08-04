import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

const dataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  logging: true, //to see underlying queries in console
  entities: ["dist/entity/*.js"],
  namingStrategy: new SnakeNamingStrategy(), //since we used updated_at, created_at in db table - this naming scheme is snake
  migrations: ["dist/db/migrations/*.js"],
  //synchronize: true - destructive - understand why? - only set during dev phase to make quick features, here we are using for deletedAt column,
  //never use in production
});

export default dataSource;
