import { DataSource, Repository } from "typeorm";
import Book from "../../entities/book";

export default class BookDAO  {
  private repository: Repository<Book>;

  constructor(connection: DataSource) {
    this.repository = connection.getRepository(Book);
  }

  findById(id: string) {
    return this.repository.findOneBy({ id });
  }

  findAll() {
    return this.repository.find();
  }
}
