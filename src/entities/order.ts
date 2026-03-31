import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import entity from "./entity";
import Client from "./client";
import { OrderStatus } from "../enum/OrderStatus";
import OrderItem from "./orderItem";
import Payment from "./payment";
import Delivery from "./delivery";

@Entity("order")
export default class Order extends entity {
  @ManyToOne(() => Client, (client) => client.order)
  @JoinColumn({ name: "clientId" })
  client: Client;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems: OrderItem[];

  @OneToMany(() => Payment, (payment) => payment.order, { cascade: true })
  payment: Payment[];

  @OneToOne(() => Delivery, (delivery) => delivery.order, { cascade: true })
  @JoinColumn()
  delivery: Delivery;

  @Column()
  orderDate: Date;

  @Column()
  totalPrice: string;

  @Column()
  freightValue: string;

  @Column()
  status: OrderStatus;

  constructor(
    client: Client,
    orderItems: OrderItem[],
    orderDate: Date,
    totalPrice: string,
    freightValue: string,
    status: OrderStatus,
  ) {
    super();
    this.client = client;
    this.orderItems = orderItems;
    this.orderDate = orderDate;
    this.totalPrice = totalPrice;
    this.freightValue = freightValue;
    this.status = status;
  }
}
