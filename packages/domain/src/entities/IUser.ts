import { IProduct } from "./IProduct";

export interface IUser {
  id: number;
  email: string;
  password: string;
  telegramId: number;
  registeredAt: Date;
  products: IProduct[]
}

