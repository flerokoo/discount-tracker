import { IPrice } from "@repo/domain/entities/IPrice";
import { IPriceRepository } from "@repo/domain/repositories/IPriceRepository";
import { DeepPartial } from "@repo/domain/types";
import { inject, injectable } from "tsyringe";
import { DataSource, FindOptionsWhere, Repository } from "typeorm";
import type { DeepPartial as TypeOrmDeepPartial} from 'typeorm'
import { Price } from "../models/Price";

@injectable()
export class TypeOrmPriceRepository implements IPriceRepository {
  repo: Repository<Price>;

  constructor(@inject("dataSource") private ds: DataSource) {
    this.repo = ds.getRepository(Price);
  }

  create(data?: DeepPartial<IPrice>): IPrice {
    return this.repo.create(data as TypeOrmDeepPartial<IPrice>);
  }

  async select(params?: DeepPartial<IPrice>): Promise<IPrice[]> {
    const where = params as FindOptionsWhere<Price>;
    return await this.repo.find({ where });
  }

  async save(users: DeepPartial<IPrice>[]): Promise<IPrice[]> {
    return await this.repo.save(users as Price[]);
  }
}
