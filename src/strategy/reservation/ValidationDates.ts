import IStrategy from "../IStrategy";
import {Reservation} from "../../entities/reservation";

export default class ValidationDates implements IStrategy<Reservation> {
    async executar(reservation: Reservation): Promise<string | undefined> {
        const errors: string[] = [];

        if (!reservation.dateStart || !reservation.dateEnd) {
            return "Datas de entrada e saída são obrigatórias";
        }

        if (reservation.dateEnd <= reservation.dateStart) {
            errors.push("Data de saída deve ser posterior à data de entrada");
        }

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        
        if (reservation.dateStart < hoje) {
            errors.push("Data de entrada não pode ser no passado");
        }

        const diffTime = Math.abs(reservation.dateEnd.getTime() - reservation.dateStart.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 1) {
            errors.push("A reserva deve ter pelo menos 1 diária");
        }

        return errors.length > 0 ? errors.join(", ") : undefined;
    }
}