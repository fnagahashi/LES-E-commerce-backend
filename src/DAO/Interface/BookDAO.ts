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

  async findRelevantBooks(
    search: string
  ) {

    const terms =
      search
      .toLowerCase()
      .split(" ");

    const query =
      this.repository
      .createQueryBuilder(
        "book"
      );

    terms.forEach(
      (term, index) => {

      query.orWhere(
        `LOWER(book.title)
        LIKE :term${index}`,
        {
          [`term${index}`]:
          `%${term}%`,
        }
      );

      query.orWhere(
        `LOWER(book.description)
        LIKE :term${index}`,
        {
          [`term${index}`]:
          `%${term}%`,
        }
      );

      query.orWhere(
        `LOWER(book.author)
        LIKE :term${index}`,
        {
          [`term${index}`]:
          `%${term}%`,
        }
      );

      query.orWhere(
        `LOWER(book.category)
        LIKE :term${index}`,
        {
          [`term${index}`]:
          `%${term}%`,
        }
      );

      query.orWhere(
        `LOWER(book.keywords)
        LIKE :term${index}`,
        {
          [`term${index}`]:
          `%${term}%`,
        }
      );

      query.orWhere(
        `LOWER(book.level)
        LIKE :term${index}`,
        {
          [`term${index}`]:
          `%${term}%`,
        }
      );
    });

    return query
      .andWhere(
        "book.active = true"
      )
      .take(10)
      .getMany();
  }
}
