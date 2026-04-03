import IStrategy from "../IStrategy";
import Order from "../../entities/order";
import { CupomType } from "../../enum/CupomType";

export default class ValidateCouponUsageStrategy implements IStrategy<Order> {
  async executar(order: Order): Promise<string | undefined> {
    if (!order.payment) return;

    for (const payment of order.payment) {
      const cupom = payment.cupom;
      if (!cupom) continue;

      if (cupom.cupomType === CupomType.exchange) {
        if (cupom.client?.id !== order.client.id) {
          return "Cupom de troca pertence a outro cliente";
        }
      }
    }

    return;
  }
}