import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import entity from "./entity";
import Order from "./order";
import Book from "./book";

@Entity("orderItem")
export default class OrderItem extends entity {
  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn({ name: "orderId" })
  order: Order;

  @ManyToOne(() => Book)
  @JoinColumn({ name: "bookId" })
  book: Book;

  @Column()
  quantity: number;

  @Column()
  unitaryValue: string;

  @Column()
  totalItemValue: string;

  constructor(
    order: Order,
    book: Book,
    quantity: number,
    unitaryValue: string,
    totalItemValue: string,
  ) {
    super();
    this.order = order;
    this.book = book;
    this.quantity = quantity;
    this.unitaryValue = unitaryValue;
    this.totalItemValue = totalItemValue;
  }
}
