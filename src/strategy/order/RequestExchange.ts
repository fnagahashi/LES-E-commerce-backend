import IStrategy from "../IStrategy";
import Order from "../../entities/order";
import { OrderStatus } from "../../enum/OrderStatus";

export default class RequestExchangeStrategy
  implements IStrategy<Order> {

  async executar(order: Order): Promise<string | undefined> {

    const itemsToExchange = order.orderItems.filter(
      item => item.exchangeRequested
    );

    if (itemsToExchange.length === 0) {
      return "Selecione ao menos um item para troca";
    }

    order.status = OrderStatus.inExchange;

    return;
  }
}