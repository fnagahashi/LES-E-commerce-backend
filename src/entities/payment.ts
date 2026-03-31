import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import entity from "./entity";
import Order from "./order";
import CreditCard from "./creditCard";
import { PaymentStatus } from "../enum/PaymentStatus";
import { PaymentMethod } from "../enum/PaymentMethod";
import Cupom from "./cupom";

@Entity("payment")
export default class Payment extends entity {
  @ManyToOne(() => Order, (order) => order.payment)
  order: Order;

  @ManyToOne(() => CreditCard, { nullable: true })
  creditCard?: CreditCard;

  @ManyToOne(() => Cupom, { nullable: true })
  cupom?: Cupom;

  @Column()
  paymentMethod: PaymentMethod;

  @Column()
  paymentValue: string;

  @Column()
  paymentStatus: PaymentStatus;

  constructor(
    order: Order,
    creditCard: CreditCard,
    cupom: Cupom,
    paymentMethod: PaymentMethod,
    paymentValue: string,
    paymentStatus: PaymentStatus,
  ) {
    super();
    this.order = order;
    this.creditCard = creditCard;
    this.cupom = cupom;
    this.paymentMethod = paymentMethod;
    this.paymentValue = paymentValue;
    this.paymentStatus = paymentStatus;
  }
}
