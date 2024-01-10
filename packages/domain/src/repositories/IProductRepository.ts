import { IProduct } from "../entities/IProduct.js";
import { DeepPartial } from "../types.js";

export interface IProductRepository {
  selectOne(params?: DeepPartial<IProduct>, withPrices?: boolean): Promise<IProduct | null>;
  select(params?: DeepPartial<IProduct>, withPrices?: boolean): Promise<IProduct[]>;
  save(products: DeepPartial<IProduct>[]): Promise<IProduct[]>;
  create(data?: DeepPartial<IProduct>): IProduct;
}

export class ProductRepository implements IProductRepository {
selectOne(params?: DeepPartial<IProduct>, withPrices?: boolean): Promise<IProduct | null> {
  throw new Error("Unimplemented");
}
  select(params?: DeepPartial<IProduct>, withPrices?: boolean): Promise<IProduct[]> {
    throw new Error("Unimplemented");
  }
  save(products: DeepPartial<IProduct>[]): Promise<IProduct[]> {
    throw new Error("Unimplemented");
  }
  create(data?: DeepPartial<IProduct>): IProduct {
    throw new Error("Unimplemented");
  }
}
