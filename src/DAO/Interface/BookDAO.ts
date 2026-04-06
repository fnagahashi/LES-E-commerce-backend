import { DataSource, Repository } from "typeorm";
import Book from "../../entities/book";

export default class BookDAO {
  private repository: Repository<Book>;

  constructor(connection: DataSource) {
    this.repository = connection.getRepository(Book);
  }

  create(book: Book) {
    return this.repository.save(book);
  }

  update(book: Book) {
    return this.repository.save(book);
  }

  async delete(book: Book): Promise<void> {
    await this.repository.remove(book);
  }

  findByFilters(filters: Partial<Book>) {
    return this.repository.find({ where: filters });
  }

  findBySearch(search: string) {
    return this.repository.find({ where: { title: search } });
  }

  async findById(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  async findAll() {
    return this.repository.find();
  }
}
