import IStrategy from "../IStrategy";
import Order from "../../entities/order";

export default class CalculateFreight implements IStrategy<Order> {
    async executar(entity: Order): Promise<string | undefined> {
        const totalItems = entity.orderItems.reduce(
            (soma, item) => soma + Number(item.unitaryValue) * item.quantity,
            0,
        );

        let freight = 0;

        if(totalItems < 60) {
            freight = 20;
        } else if(totalItems <= 60 && totalItems < 100) {
            freight = 10;
        } else if(totalItems >= 100 && totalItems < 150) {
            freight = 5;
        } else { freight = 0;}

        entity.freightValue = freight.toString();

        if (entity.delivery) {
            entity.delivery.freightValue = entity.freightValue;
        }

        return undefined;
    }
}