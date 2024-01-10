import { DataSource } from "typeorm";
import { User } from "./models/User";
import { Price } from "./models/Price";
import { Product } from "./models/Product";

const dataSource = new DataSource({
  type: "sqlite",
  database: ":memory:",
  entities: [User, Price, Product],
  migrations: ["./migrations"],
});

export default dataSource;
