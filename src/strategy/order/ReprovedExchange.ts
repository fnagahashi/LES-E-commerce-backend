import IStrategy from "../IStrategy";
import Order from "../../entities/order";
import { OrderStatus } from "../../enum/OrderStatus";

export default class ReprovedExchangeStrategy implements IStrategy<Order> {
  async executar(order: Order): Promise<string | undefined> {
    if (order.status !== OrderStatus.inExchange) {
      return "Pedido não está em troca para ser reprovado";
    }

    order.status = OrderStatus.exchangeFailed;

    return;
  }
}