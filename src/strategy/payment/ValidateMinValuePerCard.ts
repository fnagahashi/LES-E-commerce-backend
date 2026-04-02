import IStrategy from "../IStrategy";
import Order from "../../entities/order";
import { PaymentMethod } from "../../enum/PaymentMethod";

export default class ValidateMinValuePerCardStrategy implements IStrategy<Order> {
  async executar(order: Order): Promise<string | undefined> {
    const errors: string[] = [];

    if (!order.payment || order.payment.length === 0) {
      return;
    }

    const creditPayments = order.payment.filter(
      (p) => p.paymentMethod === PaymentMethod.creditCard,
    );

    for (const payment of creditPayments) {
      const value = Number(payment.paymentValue);

      if (value < 10) {
        errors.push("Cada cartão deve ter valor mínimo de R$10");
      }
    }

    return errors.length > 0 ? errors.join(", ") : undefined;
  }
}