import IStrategy from "../IStrategy";
import Order from "../../entities/order";
import { PaymentMethod } from "../../enum/PaymentMethod";

export default class ValidationTotalValue implements IStrategy<Order> {
  executar(order: Order): Promise<string | undefined> {
    const errors: string[] = [];

    const totalValue = order.payment.reduce(
      (soma, p) => soma + Number(p.paymentValue),
      0,
    );
    const totalCoupons =
      order.payment
        ?.filter(
          (p) =>
            p.paymentMethod === PaymentMethod.cupomSale ||
            p.paymentMethod === PaymentMethod.cupomExchange,
        )
        .reduce((acc, p) => acc + Number(p.paymentValue), 0) || 0;

    if (totalValue < Number(order.totalPrice) - totalCoupons) {
      errors.push(
        "O valor total dos pagamentos deve ser igual ao valor total da venda.",
      );
    }

    return Promise.resolve(errors.length > 0 ? errors.join(", ") : undefined);
  }
}
