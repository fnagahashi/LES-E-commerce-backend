import IStrategy from "../IStrategy";
import Reservation from "../../entities/reservation";

export default class CancellationPolicy implements IStrategy<Reservation> {
    async executar(reservation: Reservation): Promise<string | undefined> {
        if (!reservation.dateStart) {
            return "Data de entrada é necessária para validar política de cancelamento";
        }

        const agora = new Date();
        const diffTime = reservation.dateStart.getTime() - agora.getTime();
        const diffHours = diffTime / (1000 * 60 * 60);

        if (diffHours > 0) {
            return `Cancelamento com menos de 48 horas: multa de 50% do valor da reserva aplicável`;
        }

        if (diffHours <= 0) {
            return "Não é possível cancelar reserva após a data de início";
        }

        return undefined;
    }

    calcularMulta(valorTotal: number, horasAntecedencia: number): number {
        if (horasAntecedencia > 48) {
            return 0;
        }
        
        if (horasAntecedencia > 0) {
            return valorTotal * 0.5;
        }
        
        return valorTotal; 
    }
}