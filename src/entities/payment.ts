import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import entity from "./entity";
import Reservation from "./reservation";
import { PaymentMethod } from "../enum/PaymentMethod";

@Entity("payment")
export default class Payment extends entity {
  @OneToMany(() => Reservation, (reservation) => reservation.payment)
  reservation!: Reservation;

  @Column({ type: "enum", enum: PaymentMethod })
  type!: PaymentMethod;

  @Column()
  price!: number;

  @Column()
  paymentDate!: Date;

  @Column()
  status!: string;

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
    status: string
  ) {
    super();
    this.reservation = reservation;
    this.type = type;
    this.price = price;
    this.status = status;
    this.paymentDate = paymentDate;
  }
}
