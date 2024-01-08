import { IUser } from "../entities/IUser.js";
import { DeepPartial } from "../types.js";

export interface IUserRepository {
  select(params?: DeepPartial<IUser>, withProducts?: boolean): Promise<IUser[]>;
  save(users: IUser[]): Promise<void>;
}

export class UserRepository implements IUserRepository {
  select(params?: DeepPartial<IUser>, withProducts?: boolean): Promise<IUser[]> {
    throw new Error("Not implemented");
  }
  save(users: IUser[]): Promise<void> {
    throw new Error("Not implemented");
  }
}
