import { DataSource, Repository, FindOptionsWhere } from "typeorm";
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

  findByFilters(filters: FindOptionsWhere<Book>) {
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

  async findRelevantBooks(message: string): Promise<Book[]> {
    const books = await this.repository.find({
      where: {
        active: true,
      },
    });

    const normalizedMessage = message.toLowerCase();

    return books.filter((book) => {
      const keywords = book.keywords ?? [];

      return keywords.some((keyword) =>
        normalizedMessage.includes(keyword.toLowerCase()),
      );
    });
  }

  async findBooksByCategories(categories: string[]): Promise<Book[]> {
    return this.repository
      .createQueryBuilder("book")
      .where("book.category IN (:...categories)", { categories })
      .getMany();
  }
}
