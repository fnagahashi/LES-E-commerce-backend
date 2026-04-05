import { Column, Entity, OneToOne } from "typeorm";
import entity from "./entity";
import { Categories } from "../enum/Categories";
import Stock from "./stock";

@Entity("book")
export default class Book extends entity {
  @Column()
  title!: string;

  @Column()
  author!: string;

  @Column()
  category!: Categories;

  @Column()
  yearPublication!: string;

  @Column()
  isbn!: string;

  @Column()
  publisher!: string;

  @Column()
  quantityStock!: number;

  @Column()
  price!: string;

  @Column()
  description!: string;

  @Column()
  active!: boolean;

  @OneToOne(() => Stock, (stock) => stock.book)
  stock: Stock;

  constructor(
    title: string,
    author: string,
    category: Categories,
    yearPublication: string,
    isbn: string,
    publisher: string,
    quantityStock: number,
    price: string,
    description: string,
    active: boolean,
    stock: Stock,
  ) {
    super();
    this.title = title;
    this.author = author;
    this.category = category;
    this.yearPublication = yearPublication;
    this.isbn = isbn;
    this.publisher = publisher;
    this.quantityStock = quantityStock;
    this.price = price;
    this.description = description;
    this.active = active;
    this.stock = stock;
  }
}
