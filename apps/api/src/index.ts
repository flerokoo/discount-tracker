import "reflect-metadata";
import { WebApplication } from "@repo/lib/webapp";
import { AuthController } from "./controllers/AuthController";
import dataSource from "@repo/db/data-source";
import { TypeOrmUserRepository } from "@repo/db/repositories/TypeOrmUserRepository";
import { TypeOrmProductRepository } from "@repo/db/repositories/TypeOrmProductRepository";
import { TypeOrmPriceRepository } from "@repo/db/repositories/TypeOrmPriceRepository";
import { bind } from "@repo/lib/webapp/Binding";
import { UserRepository } from "@repo/domain/repositories/IUserRepository";
import { AuthService } from "./services/AuthService";
import { logger } from "@repo/lib/utils/logger";
import dotenv from "dotenv-safe";
import * as redis from "redis";
import { PriceRepository } from "@repo/domain/repositories/IPriceRepository";
import { ProductRepository } from "@repo/domain/repositories/IProductRepository";
import { authenticatorFactory } from "./auth";

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
  const services = [AuthService];
  const controllers = [AuthController];
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
