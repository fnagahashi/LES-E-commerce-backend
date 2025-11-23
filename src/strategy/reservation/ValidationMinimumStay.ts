import IStrategy from "../IStrategy";
import Reservation from "../../entities/reservation";

export default class ValidationMinimumStay implements IStrategy<Reservation> {
    async executar(reservation: Reservation): Promise<string | undefined> {
        if (!reservation.dateStart || !reservation.dateEnd) {
            return "Datas são necessárias";
        }

        const diffTime = reservation.dateEnd.getTime() - reservation.dateStart.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 1) {
            return "A reserva deve ter pelo menos 1 diária";
        }

        if (this.isFeriado(reservation.dateStart) && diffDays < 2) {
            return "Em feriados, a reserva deve ter no mínimo 2 diárias";
        }

        return undefined;
    }

    private isFeriado(data: Date): boolean {
        const feriados = [
            '01-01',
            '04-21',
            '05-01',
            '09-07',
            '10-12',
            '11-02',
            '11-15',
            '12-25',
        ];

        const mes = (data.getMonth() + 1).toString().padStart(2, '0');
        const dia = data.getDate().toString().padStart(2, '0');
        
        return feriados.includes(`${mes}-${dia}`);
    }
}