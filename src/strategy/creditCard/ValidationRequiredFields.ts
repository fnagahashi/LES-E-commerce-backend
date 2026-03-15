import IStrategy from "../IStrategy";
import CreditCard from "../../entities/creditCard";

export default class ValidationRequiredCreditCardFields implements IStrategy<CreditCard> {
    async executar(creditCard: CreditCard): Promise<string | undefined> {
        const errors: string[] = [];

        if(!creditCard.cardName?.trim()) errors.push("Nome do titular é obrigatório");
        if(!creditCard.cardNumber?.trim()) errors.push("Número do cartão é obrigatório");
        if(!creditCard.cardFlag) errors.push("Bandeira do cartão é obrigatória");
        if(!creditCard.securityCode?.trim()) errors.push("Código de segurança é obrigatório");

        if (errors.length > 0) {
            return errors.join(", ");
        }
    }
}