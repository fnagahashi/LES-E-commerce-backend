import IStrategy from "../IStrategy";
import Client from "../../entities/client";

export default class ValidationPassword implements IStrategy<Client> {
    async executar(client: Client): Promise<string | undefined> {
        const errors: string[] = [];
        if (!client.password.trim() || !client.password) {
            errors.push("Senha é obrigatória");
        }

        if(client.password.length < 8) {
            errors.push("A senha deve conter pelo menos 8 caracteres");
        }

        if (!/[A-Z]/.test(client.password)) {
            errors.push("A senha deve conter pelo menos uma letra maiúscula");
        }

        if (!/[a-z]/.test(client.password)) {
            errors.push("A senha deve conter pelo menos uma letra minúscula");
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(client.password)) {
            errors.push("A senha deve conter pelo menos um caractere especial");
        }

        return errors.length > 0 ? errors.join(", ") : undefined;
    }
    // if (!client.confirmPassword.trim() || !client.confirmPassword) {
    //     errors.push("Confirmação de senha é obrigatória");
    // }

    // if (client.password !== client.confirmPassword) {
    //     errors.push("As senhas não coincidem");
    // }
}
