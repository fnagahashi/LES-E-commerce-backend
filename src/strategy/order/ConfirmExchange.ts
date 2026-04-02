import IStrategy from "../IStrategy";
import Order from "../../entities/order";
import { OrderStatus } from "../../enum/OrderStatus";

export default class ConfirmReturnStrategy implements IStrategy<Order> {
  async executar(order: Order): Promise<string | undefined> {
    if (order.status !== OrderStatus.exchangeApproved) {
      return "Troca não autorizada ainda";
    }

    order.status = OrderStatus.exchanged;

    return;
  }
}