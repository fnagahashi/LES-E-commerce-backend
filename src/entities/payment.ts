import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from "typeorm";
import entity from "./entity";
import Sale from "./sale";
import { PaymentMethod } from "../enum/PaymentMethod";

export type PaymentStatus =
  | "inTransport"
  | "denied"
  | "approved"
  | "delivered"
  | "inReturn"
  | "exchanged";

@Entity("payment")
export default class Payment extends entity {
  @OneToOne(() => Sale, { onDelete: "CASCADE" })
  @JoinColumn({ name: "saleId" })
  sale!: Sale;

  @Column({ type: "enum", enum: PaymentMethod })
  type: PaymentMethod;

  @Column()
  price!: number;

  @Column()
  paymentDate!: Date;

  @Column()
  status!: PaymentStatus;

  @DeleteDateColumn()
  deletedAt?: Date;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  constructor(
    sale: Sale,
    type: PaymentMethod,
    price: number,
    paymentDate: Date,
    status: PaymentStatus
  ) {
    super();
    this.sale = sale;
    this.type = type;
    this.price = price;
    this.status = status;
    this.paymentDate = paymentDate;
  }

  isPaid(): boolean {
    return this.status === "approved";
  }

  canBeConfirmed(): boolean {
    return this.status === "approved";
  }
}
