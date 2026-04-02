import IStrategy from "../IStrategy";
import Order from "../../entities/order";

export default class CalculatedTotalOrder implements IStrategy<Order> {
    async executar (order: Order): Promise<string | undefined> {
        const totalItems = order.orderItems.reduce(
            (soma, orderItem) => soma + Number(orderItem.unitaryValue) * orderItem.quantity,
            0
        );
        order.totalPrice = totalItems + order.freightValue;
        return undefined;
    }
}