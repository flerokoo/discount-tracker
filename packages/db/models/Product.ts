import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IPrice } from "@repo/domain/entities/IPrice";
import { Price } from "./Price";
import { IProduct } from "@repo/domain/entities/IProduct";

@Entity()
export class Product implements IProduct {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string;

  @Column()
  imageUrl!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @JoinTable()
  @OneToMany(() => Price, price => price.productId)
  prices!: IPrice[];
}
