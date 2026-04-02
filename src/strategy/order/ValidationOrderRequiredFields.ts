import IStrategy from "../IStrategy";
import Order from "../../entities/order";

export default class ValidationOrderRequiredFields implements IStrategy<Order> {
    async executar(order: Order): Promise<string | undefined> {
        const errors: string[] = [];

        if (!order.client) {
            errors.push("Cliente é obrigatório");
        }

        if (!order.orderItems || order.orderItems.length === 0) {
            errors.push("A venda deve possuir pelo menos um item");
        }

        return errors.length > 0 ? errors.join(", ") : undefined;
    }
}