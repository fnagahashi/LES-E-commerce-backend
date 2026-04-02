import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import entity from "./entity";
import Book from "./book";

@Entity("stock")
export default class Stock extends entity {
  @OneToOne(() => Book)
  @JoinColumn()
  book: Book;

  @Column()
  quantity: number;

  constructor(book: Book, quantity: number) {
    super();
    this.book = book;
    this.quantity = quantity;
  }
}
