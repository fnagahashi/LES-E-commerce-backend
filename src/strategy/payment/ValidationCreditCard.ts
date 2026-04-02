import IStrategy from "../IStrategy";
import Payment from "../../entities/payment";

export default class ValidationCreditCard implements IStrategy<Payment> {
    async executar(payment: Payment): Promise<string | undefined> {
        const errors: string[] = [];

        if (payment.paymentMethod === "credit_card") {
            if(!payment.creditCard) {
                errors.push("Cartão é obrigatório");
            } 
        }
        return errors.length > 0 ? errors.join(", ") : undefined;
    }
}