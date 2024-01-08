import { IUser } from "@repo/domain/entities/IUser";
import { UserRepository } from "@repo/domain/repositories/IUserRepository";
import { DeepPartial } from "@repo/domain/types";
import { inject, injectable } from "tsyringe";
import { DataSource, FindOptionsWhere, Repository } from "typeorm";
import { User } from "../models/User";

@injectable()
export class TypeOrmUserRepository extends UserRepository {
  repo: Repository<User>;

  constructor(@inject("dataSource") private ds: DataSource) {
    super();
    this.repo = ds.getRepository(User);
  }

  async select(params?: DeepPartial<IUser>, withProducts?: boolean): Promise<IUser[]> {
    const where = params as FindOptionsWhere<User>;
    const relations = { products: withProducts };
    return await this.repo.find({ where, relations });
  }

  async save(users: IUser[]): Promise<void> {
    await this.repo.save(users as User[]);
  }
}
