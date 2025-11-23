import Guest from "../../entities/guest";
import IStrategy from "../IStrategy";

export default class ValidationEmail implements IStrategy<Guest> {
    async executar(guest: Guest): Promise<string | undefined> {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(guest.email || "")) {
            return "E-mail deve estar em formato válido (exemplo: usuario@dominio.com)";
        }
        const [, domain] = guest.email.split('@');
        if (!domain || domain.length < 3) {
            return "Domínio do e-mail inválido";
        }
        return undefined;
    }
}