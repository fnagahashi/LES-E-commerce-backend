import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
import entity from "./entity";
import Order from "./order";
import Address from "./address";

@Entity("delivery")
export default class Delivery extends entity {
  @OneToOne(() => Order, (order) => order.delivery)
  order: Order;

  @ManyToOne(() => Address)
  address: Address;

  @Column()
  freightType: string;

  @Column()
  freightValue: string;

  constructor(
    order: Order,
    address: Address,
    freightType: string,
    freightValue: string
  ) {
    super();
    this.order = order;
    this.address = address;
    this.freightType = freightType;
    this.freightValue = freightValue;
  }
}
