import "reflect-metadata";
import { WebApplication } from "@repo/lib/webapp/index";
import { Controller } from "./src/controllers/Controller";
import dataSource from '@repo/db/data-source';
import { TypeOrmUserRepository } from '@repo/db/repositories/TypeOrmUserRepository';
import { bind } from "@repo/lib/webapp/Binding";
import { UserRepository } from "../../packages/domain/repositories/IUserRepository";

(async () => {
  await dataSource.initialize();

  const app = new WebApplication({
    repositories: [
      bind(TypeOrmUserRepository).as(UserRepository)
    ],
    services: [],
    controllers: [Controller],
    values: { dataSource },
    http: {
      enabled: true,
      port: 300,
    },
  });

  await app.listen();

  // const repo = app.getDependency(UserRepository);
  // console.log(await repo.select())
})();
