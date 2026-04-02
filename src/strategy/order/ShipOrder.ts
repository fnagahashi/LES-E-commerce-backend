import IStrategy from "../IStrategy";
import Order from "../../entities/order";
import { OrderStatus } from "../../enum/OrderStatus";

export default class ShipOrderStrategy implements IStrategy<Order> {
  async executar(order: Order): Promise<string | undefined> {
    if (order.status !== OrderStatus.approved) {
      return "Pedido precisa estar aprovado";
    }

    order.status = OrderStatus.inTransportation;

    return;
  }
}