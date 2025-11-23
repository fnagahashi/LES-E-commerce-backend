import IStrategy from "../IStrategy";
import Reservation from "../../entities/reservation";

export default class ValidationCapacity implements IStrategy<Reservation> {
    async executar(reservation: Reservation): Promise<string | undefined> {
        if (!reservation.room || reservation.qntAldults === undefined || reservation.qntChildren === undefined) {
            return "Dados insuficientes para validar capacidade";
        }

        const errors: string[] = [];
        const room = reservation.room;

        const totalHospedes = reservation.qntAldults + reservation.qntChildren;
        const capacidadeTotal = (room.qntdAdultos || 0) + (room.qntdCriancas || 0);

        if (totalHospedes > capacidadeTotal) {
            errors.push(`Capacidade total excedida: quarto suporta ${capacidadeTotal} pessoas`);
        }

        if (reservation.qntAldults > (room.qntdAdultos || 0)) {
            errors.push(`Máximo de adultos excedido: ${room.qntdAdultos} permitidos`);
        }

        if (reservation.qntChildren > (room.qntdCriancas || 0)) {
            errors.push(`Máximo de crianças excedido: ${room.qntdCriancas} permitidas`);
        }

        return errors.length > 0 ? errors.join("; ") : undefined;
    }
}