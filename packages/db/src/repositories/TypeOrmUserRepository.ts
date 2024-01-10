import { IUser } from "@repo/domain/src/entities/IUser";
import { IUserRepository, UserRepository } from "@repo/domain/src/repositories/IUserRepository";
import { DeepPartial } from "@repo/domain/src/types";
import { inject, injectable, singleton } from "tsyringe";
import { DataSource, FindOptionsWhere, Repository } from "typeorm";
import { User } from "../models/User";
import type { DeepPartial as TypeOrmDeepPartial} from 'typeorm'

@injectable()
export class TypeOrmUserRepository implements IUserRepository {
  repo: Repository<User>;

  constructor(@inject("dataSource") private ds: DataSource) {
    this.repo = ds.getRepository(User);
  }

  create(data?: DeepPartial<IUser>): IUser {
    return this.repo.create(data as TypeOrmDeepPartial<IUser>);
  }

  async selectOne(params?: DeepPartial<IUser>, withProducts?: boolean): Promise<IUser | null> {
    const where = params as FindOptionsWhere<User>;
    const relations = { products: withProducts };
    return await this.repo.findOne({ where, relations });
  }

  async select(params?: DeepPartial<IUser>, withProducts?: boolean): Promise<IUser[]> {
    const where = params as FindOptionsWhere<User>;
    const relations = { products: withProducts };
    return await this.repo.find({ where, relations });
  }

  async save(users: DeepPartial<IUser>[]): Promise<IUser[]> {
    return await this.repo.save(users as User[]);
  }
}
