import IStrategy from "../IStrategy";
import Payment from "../../entities/payment";

export default class ValidationCupom implements IStrategy<Payment> {
    async executar(payment: Payment): Promise<string | undefined> {
        const errors: string[] = [];

        if (payment.paymentMethod === "cupom_exchange" || payment.paymentMethod === "cupom_sale") {
            if(!payment.cupom) {
                errors.push("Cupom é obrigatório");
            } else if (!payment.cupom.isActive) {
                errors.push("Cupom inválido");
            }
        }

        return errors.length > 0 ? errors.join(", ") : undefined;
    }
}