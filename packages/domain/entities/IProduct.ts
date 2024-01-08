import { IPrice } from "./IPrice";


export interface IProduct {
  id: number;
  url: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  prices: IPrice[];
}
