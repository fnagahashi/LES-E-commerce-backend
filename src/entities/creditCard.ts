import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import entity from "./entity";
import Client from "./client";
import { CardsFlags } from "../enum/CardsFlags";

@Entity("creditCard")
export default class CreditCard extends entity {
  @Column()
  cardNumber!: string;

  @Column()
  cardName!: string;

  @Column()
  cardFlag!: CardsFlags;

  @Column()
  securityCode!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
