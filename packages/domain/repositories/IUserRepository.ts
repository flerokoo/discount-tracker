import { IUser } from "../entities/IUser.js";
import { DeepPartial } from "../types.js";

export interface IUserRepository {
  selectOne(params?: DeepPartial<IUser>, withProducts?: boolean): Promise<IUser | null>;
  select(params?: DeepPartial<IUser>, withProducts?: boolean): Promise<IUser[]>;
  save(users: DeepPartial<IUser>[]): Promise<IUser[]>;
  create(data?: DeepPartial<IUser>): IUser;
}

export class UserRepository implements IUserRepository {
  selectOne(params?: DeepPartial<IUser>, withProducts?: boolean): Promise<IUser | null> {
    throw new Error("Unimplemented");
  }
  select(params?: DeepPartial<IUser>, withProducts?: boolean): Promise<IUser[]> {
    throw new Error("Unimplemented");
  }
  save(users: DeepPartial<IUser>[]): Promise<IUser[]> {
    throw new Error("Unimplemented");
  }
  create(data?: DeepPartial<IUser>): IUser {
    throw new Error("Unimplemented");
  }
}
