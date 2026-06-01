import IStrategy from "../IStrategy";
import ChatRecommendation from "../../entities/chatRecommendation";
import BookDAO from "../../DAO/Interface/BookDAO";
import AIRecommendationService from "../../services/AIRecommendationService";

export default class FindRelevantBooksStrategy
  implements IStrategy<ChatRecommendation> {

  private aiService =
    new AIRecommendationService();

  constructor(
    private readonly bookDAO: BookDAO,
  ) {}

  async executar(
    entity: ChatRecommendation,
  ): Promise<string | undefined> {

    if (!entity.message?.trim()) {
      return "Digite uma pergunta para recomendar livros.";
    }

    const intent =
      await this.aiService
        .extractIntent(
          entity.message
        );

    console.log("Intent extraída:", intent);

    const books =
      await this.bookDAO
        .findBooksByAI(
          intent.category,
          intent.keywords,
        );

    console.log("Livros encontrados:", books);

    entity.recommendedBooks =
      books;

    return undefined;
  }
}