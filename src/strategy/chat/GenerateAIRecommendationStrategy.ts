import IStrategy
from "../IStrategy";

import ChatRecommendation
from "../../entities/chatRecommendation";

import OpenAIService
from "../../services/OpenAIService";

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

    entity.response =
      await this.openAIService
      .recommendBooks(
        entity.message,
        entity.recommendedBooks,
        entity.purchaseHistory
      );

    return undefined;
  }
}