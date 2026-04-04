import IStrategy from "../IStrategy";
import Order from "../../entities/order";
import { PaymentMethod } from "../../enum/PaymentMethod";

export default class CalculatedTotalOrder implements IStrategy<Order> {
  async executar(order: Order): Promise<string | undefined> {
    const totalItems = order.orderItems.reduce(
      (soma, orderItem) =>
        soma + Number(orderItem.unitaryValue) * orderItem.quantity,
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
    order.totalPrice =
      (Number((totalItems - totalCoupons).toFixed(2)) +
      Number(order.freightValue)).toString();
    return undefined;
  }
}
