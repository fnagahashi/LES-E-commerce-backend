import IStrategy from "../IStrategy";
import Payment from "../../entities/payment";
import Reservation from "../../entities/reservation";

export default class RefundCalculationStrategy implements IStrategy<Payment> {
    async executar(payment: Payment): Promise<string | undefined> {
        
        if (payment.status !== 'cancelled') {
            return undefined;
        }

        if (!payment.reservation) {
            return "Reserva é necessária para calcular estorno";
        }

        const valorEstorno = this.calcularValorEstorno(payment);
        
        payment.price = valorEstorno;

        return undefined;
    }

    private calcularValorEstorno(payment: Payment): number {
        const reservation = payment.reservation;
        const agora = new Date();
        const diffTime = reservation.dateStart.getTime() - agora.getTime();
        const diffHours = diffTime / (1000 * 60 * 60);

        if (diffHours > 48) {
            return payment.price;
        } else if (diffHours > 0) {
            return payment.price * 0.5;
        } else {
            return 0;
        }
    }

    calcularEstorno(reservation: Reservation, valorPago: number): number {
        const agora = new Date();
        const diffTime = reservation.dateStart.getTime() - agora.getTime();
        const diffHours = diffTime / (1000 * 60 * 60);

        if (diffHours > 48) {
            return valorPago;
        } else if (diffHours > 0) {
            return valorPago * 0.5;
        } else {
            return 0;
        }
    }
}