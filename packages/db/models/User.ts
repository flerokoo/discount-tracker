import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { IUser } from "@repo/domain/entities/IUser";
import { Product } from "./Product";
import { IProduct } from "@repo/domain/entities/IProduct";

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true, default: null, unique: true })
  telegramId!: number;

  @CreateDateColumn()
  registeredAt!: Date;

  @JoinTable()
  @ManyToMany(() => Product, {cascade: true})
  products!: Product[];
}


