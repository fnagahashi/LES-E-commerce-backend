import IStrategy from "../IStrategy";
import OrderDAO from "../../DAO/Interface/OrderDAO";
import ChatRecommendation
from "../../entities/chatRecommendation";

export default class
LoadClientPurchaseHistoryStrategy
implements IStrategy<ChatRecommendation> {

  constructor(
    private readonly orderDAO: OrderDAO
  ) {}

  async executar(
    entity: ChatRecommendation
  ): Promise<string | undefined> {

    const orders =
      await this.orderDAO
      .findByClient(
        entity.client.id
      );

    entity.purchaseHistory =
      orders;

    return undefined;
  }
}