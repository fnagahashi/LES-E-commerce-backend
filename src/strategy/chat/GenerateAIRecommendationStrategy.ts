import IStrategy from "../IStrategy";
import ChatRecommendation from "../../entities/chatRecommendation";
import OpenAIService from "../../services/AIRecommendationService";

export default class
GenerateAIRecommendationStrategy
implements
IStrategy<ChatRecommendation> {

  private openAIService =
    new OpenAIService();

  async executar(
    entity:
    ChatRecommendation
  ): Promise<
    string | undefined
  > {

    if (entity.response) {
      return undefined;
    }

    entity.response =
      await this.openAIService
      .recommendBooks(
        entity.message,
        entity.recommendedBooks,
        entity.purchaseHistory,
      );

    return undefined;
  }
}