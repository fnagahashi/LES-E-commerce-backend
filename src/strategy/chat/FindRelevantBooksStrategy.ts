import IStrategy from "../IStrategy";
import ChatRecommendation from "../../entities/chatRecommendation";
import BookDAO from "../../DAO/Interface/BookDAO";
import AIRecommendationService from "../../services/AIRecommendationService";

export default class FindRelevantBooksStrategy
  implements IStrategy<ChatRecommendation>
{
  private aiService = new AIRecommendationService();

  constructor(private readonly bookDAO: BookDAO) {}

  async executar(entity: ChatRecommendation): Promise<string | undefined> {
    if (!entity.message?.trim()) {
      return "Digite uma pergunta para recomendar livros.";
    }

    const intent = await this.aiService.extractIntent(entity.message);

    console.log("Intent extraída:", intent);

    if (!intent.valid) {
      entity.response = await this.aiService.generateInvalidRequestResponse(
        entity.message,
        intent.reason,
      );

      entity.recommendedBooks = [];

      return undefined;
    }

    let books = [];

    if (intent.useHistory) {
      const categories = entity.purchaseHistory
        .reduce((acc, order) => acc.concat(order.orderItems), [] as any[])
        .map((item) => item.book?.category)
        .filter(Boolean);

      const uniqueCategories = Array.from(new Set(categories));

      console.log("Categorias do histórico:", uniqueCategories);

      books = await this.bookDAO.findBooksByCategories(uniqueCategories);
    } else {
      books = await this.bookDAO.findBooksByAI(
        intent.category,
        intent.keywords,
      );
    }

    console.log("Livros encontrados:", books);

    if (books.length === 0) {
      entity.response =
        "Não encontrei livros relacionados ao que você procura.";

      entity.recommendedBooks = [];

      return undefined;
    }

    entity.recommendedBooks = books;

    return undefined;
  }
}
