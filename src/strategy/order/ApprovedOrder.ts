import IStrategy from "../IStrategy";
import Order from "../../entities/order";
import { OrderStatus } from "../../enum/OrderStatus";

export default class ApproveOrderStrategy implements IStrategy<Order> {
  async executar(order: Order): Promise<string | undefined> {
    if (order.status !== OrderStatus.inProcessing) {
      return "Pedido não está em processamento";
    }

    order.status = OrderStatus.approved;

    return;
  }
}