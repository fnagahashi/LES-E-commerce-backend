import IStrategy from "../IStrategy";
import Order from "../../entities/order";

export default class ValidationTotalValue implements IStrategy<Order> {
  executar(order: Order): Promise<string | undefined> {
    const errors: string[] = [];

    const totalValue = order.payment.reduce(
      (soma, p) => soma +Number( p.paymentValue),
      0,
    );

    if (totalValue < Number(order.totalPrice)) {
      errors.push(
        "O valor total dos pagamentos deve ser igual ao valor total da venda.",
      );
    }

    return Promise.resolve(errors.length > 0 ? errors.join(", ") : undefined);
  }
}
