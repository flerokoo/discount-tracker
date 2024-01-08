import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IPrice } from "@repo/domain/entities/IPrice";
import { Product } from "./Product";


@Entity()
export class Price implements IPrice {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Product)
  productId!: number;

  @Column()
  price!: number;

  @Column()
  currency!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
