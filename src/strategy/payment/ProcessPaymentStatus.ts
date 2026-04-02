import IStrategy from "../IStrategy";
import Order from "../../entities/order";
import { PaymentStatus } from "../../enum/PaymentStatus";

export default class ProcessPaymentStatusStrategy implements IStrategy<Order> {
  async executar(order: Order): Promise<string | undefined> {
    if (!order.payment) return;

    let hasError = false;

    for (const payment of order.payment) {
      if (!payment.paymentValue || Number(payment.paymentValue) <= 0) {
        payment.paymentStatus = PaymentStatus.refused;
        hasError = true;
      } else {
        payment.paymentStatus = PaymentStatus.approved;
      }
    }

    if (hasError) {
      return "Pagamento não aprovado";
    }

    return;
  }
}