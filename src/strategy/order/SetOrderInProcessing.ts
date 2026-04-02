import IStrategy from "../IStrategy";
import Order from "../../entities/order";
import { OrderStatus } from "../../enum/OrderStatus";

export default class SetOrderInProcessingStrategy implements IStrategy<Order> {
  async executar(order: Order): Promise<string | undefined> {
    order.status = OrderStatus.inProcessing;
    return;
  }
}