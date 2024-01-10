import "reflect-metadata";
import { WebApplication } from "@repo/lib/src/webapp";
import { AuthController } from "./controllers/AuthController";
import { ProductController } from "./controllers/ProductController";
import dataSource from "@repo/db/src/data-source";
import { TypeOrmUserRepository, TypeOrmPriceRepository, TypeOrmProductRepository } from "@repo/db";
import { UserRepository, PriceRepository, ProductRepository } from "@repo/domain";
import { AuthService } from "./services/AuthService";
import { ProductService } from "./services/ProductService";
import dotenv from "dotenv-safe";
import * as redis from "redis";
import { authenticatorFactory } from "./auth";
import { bind, logger } from "@repo/lib";

dotenv.config({ allowEmptyValues: true });

(async () => {
  await dataSource.initialize();
  await dataSource.synchronize(true);

  const redisClient = redis.createClient({ url: process.env.REDIS_URL });
  await redisClient.connect();

  const repositories = [
    bind(TypeOrmUserRepository).as(UserRepository),
    bind(TypeOrmPriceRepository).as(PriceRepository),
    bind(TypeOrmProductRepository).as(ProductRepository),
  ];
  const services = [AuthService, ProductService];
  const controllers = [AuthController, ProductController];
  const values = {
    jwtSecret: process.env.JWT_SECRET,
    scraperHost: process.env.SCRAPER_HOST,
    scraperPort: parseInt(process.env.SCRAPER_PORT!),
    dataSource,
    redisClient,
  };

  const app = new WebApplication({
    repositories,
    services,
    controllers,
    values,
    auth: authenticatorFactory,
    http: {
      enabled: true,
      port: parseInt(process.env.PORT!) || 3000,
    },
  });

  await app.listen();

  logger.info("Listening");
})();
