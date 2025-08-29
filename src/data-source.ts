import "reflect-metadata";
import { Product } from "./entity/Product.entity.js";
import { User } from "./entity/User.entity.js";
import { Review } from "./entity/Review.entity.js";
import { DataSource } from "typeorm";
import { config } from "dotenv";

config();

const myDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "",
  synchronize: false,
  logging: true,
  entities: [User, Product, Review],
  migrations: ["src/migrations/*.ts"],
  extra: {
    connectionTimeoutMills: 50000,
    idleTimeoutMills: 40000
  }
});

export { myDataSource };
