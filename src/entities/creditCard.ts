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
  cardExpirationDate!: string;

  @Column()
  cardFlag!: CardsFlags;

  @Column()
  securityCode!: string;

  @ManyToOne(() => Client, (client) => client.creditCard)
  client: Client;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  constructor(
    cardNumber: string,
    cardName: string,
    cardExpirationDate: string,
    cardFlag: CardsFlags,
    securityCode: string,
    client?: Client,
  ) {
    super();
    this.cardNumber = cardNumber;
    this.cardName = cardName;
    this.cardExpirationDate = cardExpirationDate;
    if (cardFlag) {
      this.cardFlag = cardFlag;
    }
    this.securityCode = securityCode;
    if (client) {
      this.client = client;
    }
  }
}
