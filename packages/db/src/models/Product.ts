import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IPrice } from "@repo/domain/src/entities/IPrice";
import { Price } from "./Price";
import { IProduct } from "@repo/domain/src/entities/IProduct";

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
  @OneToMany(() => Price, price => price.productId, { cascade: true, onDelete: 'CASCADE' })
  prices!: IPrice[];
}
