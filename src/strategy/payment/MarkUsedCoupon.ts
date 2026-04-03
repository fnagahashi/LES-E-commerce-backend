import CupomDAO from "../../DAO/Interface/CupomDAO";
import Order from "../../entities/order";
import IStrategy from "../IStrategy";

export default class MarkCouponAsUsedStrategy implements IStrategy<Order> {
  constructor(private cupomDAO: CupomDAO) {}

  async executar(order: Order): Promise<string | undefined> {
    if (!order.payment) return;

    for (const payment of order.payment) {
      if (payment.cupom) {
        await this.cupomDAO.markAsUsed(payment.cupom.id);
      }
    }

    return;
  }
}