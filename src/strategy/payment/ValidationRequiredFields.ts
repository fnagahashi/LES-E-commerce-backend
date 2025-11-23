import IStrategy from "../IStrategy";
import Payment from "../../entities/payment";

export default class ValidationRequiredPaymentFields implements IStrategy<Payment> {
    async executar(payment: Payment): Promise<string | undefined> {
        const errors: string[] = [];

        if (!payment.reservation) {
            errors.push("Reserva é obrigatória");
        }

        if (!payment.type?.trim()) {
            errors.push("Forma de pagamento é obrigatória");
        }

        if (payment.price === undefined || payment.price === null) {
            errors.push("Valor do pagamento é obrigatório");
        } else if (payment.price <= 0) {
            errors.push("Valor do pagamento deve ser maior que zero");
        }

        if (!payment.paymentDate) {
            errors.push("Data do pagamento é obrigatória");
        }

        if (!payment.status?.trim()) {
            errors.push("Status do pagamento é obrigatório");
        } else {
            const statusValidos = ['pending', 'approved', 'denied', 'refunded', 'cancelled'];
            if (!statusValidos.includes(payment.status.toLowerCase())) {
                errors.push(`Status do pagamento inválido. Status válidos: ${statusValidos.join(', ')}`);
            }
        }
        return errors.length > 0 ? errors.join(", ") : undefined;
    }
}