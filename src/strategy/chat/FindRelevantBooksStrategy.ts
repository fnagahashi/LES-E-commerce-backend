import IStrategy
from "../IStrategy";

import ChatRecommendation
from "../../entities/chatRecommendation";

import BookDAO
from "../../DAO/Interface/BookDAO";

export default class
FindRelevantBooksStrategy
implements
IStrategy<ChatRecommendation> {

  constructor(
    private readonly bookDAO: BookDAO
  ) {}

  async executar(
    entity:
    ChatRecommendation
  ): Promise<
    string | undefined
  > {

    const books =
      await this.bookDAO
      .findRelevantBooks(
        entity.message
      );

    entity.recommendedBooks =
      books;

    return undefined;
  }
}