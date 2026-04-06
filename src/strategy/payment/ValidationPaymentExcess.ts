import IStrategy from "../IStrategy";
import Order from "../../entities/order";

export default class ValidationPaymentExcess implements IStrategy<Order> {
  async executar(order: Order): Promise<string | undefined> {
    const errors: string[] = [];

    const totalPayments = order.payment.reduce(
      (soma, p) => soma + Number(p.paymentValue),
      0,
    );
    console.log("totalPayments", totalPayments);
    if (totalPayments > Number(order.totalPrice)) {
      errors.push("Valor dos pagamentos excede o total da venda");
    }

    return errors.length > 0 ? errors.join(", ") : undefined;
  }
}
