import IStrategy from "../IStrategy";
import Order from "../../entities/order";
import { OrderStatus } from "../../enum/OrderStatus";

export default class ValidateExchangeRequestStrategy implements IStrategy<Order> {
  async executar(order: Order): Promise<string | undefined> {
    if (order.status !== OrderStatus.delivered) {
      return "Só é possível solicitar troca de pedidos entregues";
    }

    return;
  }
}