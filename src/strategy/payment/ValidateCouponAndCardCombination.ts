import IStrategy from "../IStrategy";
import Order from "../../entities/order";
import { PaymentMethod } from "../../enum/PaymentMethod";

export default class ValidateCouponAndCardCombinationStrategy implements IStrategy<Order> {
  async executar(order: Order): Promise<string | undefined> {
    const errors: string[] = [];

    if (!order.payment) return;

    const totalOrder = Number(order.totalPrice);

    const couponTotal = order.payment
      .filter((p) => p.paymentMethod === PaymentMethod.cupomExchange || p.paymentMethod === PaymentMethod.cupomSale)
      .reduce((acc, p) => acc + Number(p.paymentValue), 0);

    const cardTotal = order.payment
      .filter((p) => p.paymentMethod === PaymentMethod.creditCard)
      .reduce((acc, p) => acc + Number(p.paymentValue), 0);

    if (couponTotal > totalOrder) {
      errors.push("Valor de cupons não pode ultrapassar o total da compra");
    }

    if (couponTotal > 0 && cardTotal > 0) {
      if (couponTotal < totalOrder && cardTotal <= 0) {
        errors.push("Pagamento com cartão inválido");
      }
    }

    return errors.length > 0 ? errors.join(", ") : undefined;
  }
}