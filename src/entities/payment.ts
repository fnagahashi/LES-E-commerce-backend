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
import Reservation from "./reservation";
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
  @OneToOne(() => Reservation, { onDelete: "CASCADE" })
  @JoinColumn({ name: "reservationId" })
  reservation!: Reservation;

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
    reservation: Reservation,
    type: PaymentMethod,
    price: number,
    paymentDate: Date,
    status: PaymentStatus
  ) {
    super();
    this.reservation = reservation;
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
