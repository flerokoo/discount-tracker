import { IProduct } from "@repo/domain/entities/IProduct";
import { IProductRepository } from "@repo/domain/repositories/IProductRepository";
import { DeepPartial } from "@repo/domain/types";
import { inject, injectable } from "tsyringe";
import { DataSource, FindOptionsWhere, Repository } from "typeorm";
import type { DeepPartial as TypeOrmDeepPartial} from 'typeorm'
import { Product } from "../models/Product";

@injectable()
export class TypeOrmProductRepository implements IProductRepository {
  repo: Repository<Product>;

  constructor(@inject("dataSource") private ds: DataSource) {
    this.repo = ds.getRepository(Product);
  }

  create(data?: DeepPartial<IProduct>): IProduct {
    return this.repo.create(data as TypeOrmDeepPartial<IProduct>);
  }

  async selectOne(params?: DeepPartial<IProduct>, withPrices?: boolean): Promise<IProduct | null> {
    const where = params as FindOptionsWhere<Product>;
    const relations = { prices: withPrices };
    return await this.repo.findOne({ where, relations });
  }

  async select(params?: DeepPartial<IProduct>, withPrices?: boolean): Promise<IProduct[]> {
    const where = params as FindOptionsWhere<Product>;
    const relations = { prices: withPrices };
    return await this.repo.find({ where, relations });
  }

  async save(users: DeepPartial<IProduct>[]): Promise<IProduct[]> {
    return await this.repo.save(users as Product[]);
  }
}
