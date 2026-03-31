import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import entity from "./entity";
import Client from "./client";
import { OrderStatus } from "../enum/OrderStatus";
import OrderItem from "./orderItem";

@Entity("order")
export default class Order extends entity {
  @ManyToOne(() => Client, (client) => client.order)
  @JoinColumn({ name: "clientId" })
  client: Client;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

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
