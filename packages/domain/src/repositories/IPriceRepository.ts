import { IPrice } from "../entities/IPrice.js";
import { DeepPartial } from "../types.js";

export interface IPriceRepository {
  select(params?: DeepPartial<IPrice>): Promise<IPrice[]>;
  save(users: DeepPartial<IPrice>[]): Promise<IPrice[]>;
  create(data?: DeepPartial<IPrice>): IPrice;
}

export class PriceRepository implements IPriceRepository {
  select(params?: DeepPartial<IPrice>): Promise<IPrice[]> {
    throw new Error("Unimplemented");
  }
  save(users: DeepPartial<IPrice>[]): Promise<IPrice[]> {
    throw new Error("Unimplemented");
  }
  create(data?: DeepPartial<IPrice>): IPrice {
    throw new Error("Unimplemented");
  }
}
