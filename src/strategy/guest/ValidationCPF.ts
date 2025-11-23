import IStrategy from "../IStrategy";
import Guest from "../../entities/guest";

export default class ValidationCPF implements IStrategy<Guest> {
    async executar(guest: Guest): Promise<string | undefined> {
        const cpf = guest.cpf?.trim();
        
        if (!cpf) {
            return "CPF é obrigatório";
        }

        const cpfLimpo = cpf.replace(/\D/g, '');

        if (cpfLimpo.length !== 11) {
            return "CPF deve conter 11 dígitos";
        }

        if (/^(\d)\1{10}$/.test(cpfLimpo)) {
            return "CPF inválido";
        }

        if (!this.validarDigitosVerificadores(cpfLimpo)) {
            return "CPF inválido";
        }

        return undefined;
    }
    private validarDigitosVerificadores(cpf: string): boolean {
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        
        let resto = soma % 11;
        const digito1 = resto < 2 ? 0 : 11 - resto;

        if (digito1 !== parseInt(cpf.charAt(9))) {
            return false;
        }

        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        
        resto = soma % 11;
        const digito2 = resto < 2 ? 0 : 11 - resto;

        return digito2 === parseInt(cpf.charAt(10));
    }
}