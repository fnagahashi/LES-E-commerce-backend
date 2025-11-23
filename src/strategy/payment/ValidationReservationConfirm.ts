// src/strategy/payment/ValidationReservationConfirm.ts
import IStrategy from "../IStrategy";
import Payment from "../../entities/payment";
import Reservation from "../../entities/reservation";
import ReservationDAO from "../../DAO/Interface/ReservationDAO";

export default class ValidationReservationConfirm implements IStrategy<Payment> {
    constructor(private readonly reservationDAO: ReservationDAO) {}

    async executar(payment: Payment): Promise<string | undefined> {
        if (!payment.reservation) {
            return "Reserva é necessária para validação";
        }

        const reservaAtual = await this.buscarReservaNoBanco(payment.reservation.id);
        if (!reservaAtual) {
            return "Reserva não encontrada no sistema";
        }

        const statusReserva = reservaAtual.paymentStatus.toLowerCase();

        if (payment.status?.toLowerCase() === 'approved') {
            
            if (!['proposta', 'pending', 'pendente'].includes(statusReserva)) {
                return `Não é possível confirmar reserva com status: ${statusReserva}`;
            }
            
            reservaAtual.paymentStatus = 'confirmed';
            await this.reservationDAO.update(reservaAtual);
        }

        if (payment.status?.toLowerCase() === 'denied' && statusReserva === 'pending') {
            reservaAtual.paymentStatus = 'cancelled';
            await this.reservationDAO.update(reservaAtual);
        }

        if (payment.status?.toLowerCase() === 'refunded') {
            reservaAtual.paymentStatus = 'cancelled';
            await this.reservationDAO.update(reservaAtual);
            
            console.log(`🔄 Reserva ${reservaAtual.codeReservation} cancelada - estorno realizado`);
        }

        return undefined;
    }

    private async buscarReservaNoBanco(reservaId: string): Promise<Reservation | null> {
        try {
            const reservas = await this.reservationDAO.list(
                { id: reservaId } as Reservation,
                "buscarPorId"
            );
            return reservas[0] || null;
        } catch (error) {
            console.error("Erro ao buscar reserva:", error);
            return null;
        }
    }

    async confirmReservation(reservaId: string): Promise<{ confirm: boolean; motivo?: string }> {
        const reserva = await this.buscarReservaNoBanco(reservaId);
        
        if (!reserva) {
            return { confirm: false, motivo: "Reserva não encontrada" };
        }

        const status = reserva.paymentStatus.toLowerCase();
        
        if (!['proposta', 'pending', 'pendente'].includes(status)) {
            return { confirm: false, motivo: `Reserva com status inválido: ${status}` };
        }

        return { confirm: true };
    }
}