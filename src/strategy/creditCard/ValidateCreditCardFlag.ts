import IStrategy from "../IStrategy";
import CreditCard from "../../entities/creditCard";
import { CardsFlags } from "../../enum/CardsFlags";

export default class ValidateCreditCardFlag implements IStrategy<CreditCard> {
    async executar(creditCard: CreditCard): Promise<string | undefined> {
        if (creditCard.cardFlag && !Object.values(CardsFlags).includes(creditCard.cardFlag)) {
            return "Bandeira do cartão inválida";
        }
    }
}