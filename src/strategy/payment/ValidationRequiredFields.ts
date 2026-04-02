import IStrategy from "../IStrategy";
import Order from "../../entities/order";

export default class ValidationRequiredFields implements IStrategy<Order> {
    async executar(order: Order): Promise<string | undefined> {
        const errors: string[] = [];

        if (!order.payment || order.payment.length === 0) {
            errors.push("A venda deve possuir pelo menos um pagamento");
        }

        return errors.length > 0 ? errors.join(", ") : undefined;
    }
}