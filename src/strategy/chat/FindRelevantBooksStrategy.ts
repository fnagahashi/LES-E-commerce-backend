import IStrategy from "../IStrategy";
import ChatRecommendation from "../../entities/chatRecommendation";
import BookDAO from "../../DAO/Interface/BookDAO";

export default class FindRelevantBooksStrategy
  implements IStrategy<ChatRecommendation> {

  constructor(
    private readonly bookDAO: BookDAO,
  ) {}

  async executar(
    entity: ChatRecommendation,
  ): Promise<string | undefined> {

    if (
      !entity.message ||
      entity.message.trim() === ""
    ) {
      return "Digite uma pergunta para recomendar livros.";
    }

    const books =
      await this.bookDAO
        .findRelevantBooks(
          entity.message,
        );

    entity.recommendedBooks =
      books;

    if (books.length === 0) {
      return undefined;
    }

    return undefined;
  }
}