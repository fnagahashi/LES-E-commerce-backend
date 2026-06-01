import IStrategy from "../IStrategy";
import ChatRecommendation from "../../entities/chatRecommendation";
import BookDAO from "../../DAO/Interface/BookDAO";
import OrderDAO from "../../DAO/Interface/OrderDAO";
import Book from "../../entities/book";
import { Categories } from "../../enum/Categories";
import book from "../../entities/book";

export default class FindRelevantBooksStrategy
  implements IStrategy<ChatRecommendation>
{
  constructor(
    private readonly bookDAO: BookDAO,
    private readonly orderDAO: OrderDAO,
  ) {}

  async executar(entity: ChatRecommendation): Promise<string | undefined> {
    if (!entity.message || entity.message.trim() === "") {
      return "Digite algo para eu recomendar livros.";
    }

    const orders = await this.orderDAO.findByClient(entity.client.id);

    entity.purchaseHistory = orders;

    const purchasedBooks = orders.reduce((acc: Book[], order: { orderItems: { book: Book; }[]; }) => {
      acc.push(...order.orderItems.map((item: { book: Book; }) => item.book));
      return acc;
    }, [] as Book[]);

    const purchasedBookIds = purchasedBooks.map((book: Book) => book.id);

    const booksByMessage = await this.bookDAO.findRelevantBooks(entity.message);

    const categories = Array.from(
      new Set(
        purchasedBooks.map(
          (book: { category: Categories }) => book.category,
        ) as Book["category"][],
      ),
    );

    const booksByHistory = await this.bookDAO.findBooksByCategories(categories);

    const allBooks = [...booksByMessage, ...booksByHistory];

    const uniqueBooks = allBooks.filter(
      (book, index, self) => index === self.findIndex((b) => b.id === book.id),
    );

    const filteredBooks = uniqueBooks.filter(
      (book) => !purchasedBookIds.includes(book.id),
    );

    entity.recommendedBooks = filteredBooks.slice(0, 5);

    return undefined;
  }
}
