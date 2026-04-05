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
import Payment from "./payment";

@Entity("creditCard")
export default class CreditCard extends entity {
  @Column()
  cardNumber!: string;

  @Column()
  cardName!: string;

  @Column()
  cardExpirationDate!: string;

  @Column()
  cardHolderName!: string;

  @Column()
  cardFlag!: CardsFlags;

  @Column()
  securityCode!: string;

  @Column({ default: false })
  isMainCard!: boolean;

  @ManyToOne(() => Client, (client) => client.creditCard)
  client?: Client;

  @ManyToOne(() => Payment, (payment) => payment.creditCard)
  payment?: Payment;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  constructor(
    cardNumber: string,
    cardName: string,
    cardExpirationDate: string,
    cardHolderName: string,
    cardFlag: CardsFlags,
    securityCode: string,
    isMainCard: boolean,
    client?: Client,
    payment?: Payment
  ) {
    super();
    this.cardNumber = cardNumber;
    this.cardName = cardName;
    this.cardExpirationDate = cardExpirationDate;
    this.cardHolderName = cardHolderName;
    if (cardFlag) {
      this.cardFlag = cardFlag;
    }
    this.securityCode = securityCode;
    this.isMainCard = isMainCard;
    if (client) {
      this.client = client;
    }
    if (payment) {
      this.payment = payment;
    }
  }
}
