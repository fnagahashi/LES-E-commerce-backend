import IStrategy from "../IStrategy";
import Order from "../../entities/order";
import { OrderStatus } from "../../enum/OrderStatus";

export default class DeliverOrderStrategy implements IStrategy<Order> {
  async executar(order: Order): Promise<string | undefined> {
    if (order.status !== OrderStatus.inTransportation) {
      return "Pedido não está em trânsito";
    }

    order.status = OrderStatus.delivered;

    return;
  }
}