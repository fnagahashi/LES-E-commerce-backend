// src/strategy/payment/ValidationReservationConfirm.ts
import IStrategy from "../IStrategy";
import Payment from "../../entities/payment";
import Reservation from "../../entities/reservation";
import ReservationDAO from "../../DAO/Interface/ReservationDAO";
import PaymentDAO from "../../DAO/Interface/PaymentDAO";

export default class ValidationReservationConfirm
  implements IStrategy<Payment>
{
  constructor(
    private readonly reservationDAO: ReservationDAO,
    private readonly paymentDAO: PaymentDAO
  ) {}

  async executar(payment: Payment): Promise<string | undefined> {
    if (!payment.reservation) {
      return "Reserva é necessária para validação";
    }

    const reservaAtual = await this.buscarReservaNoBanco(
      payment.reservation.id
    );
    if (!reservaAtual) {
      return "Reserva não encontrada no sistema";
    }

    const statusReserva = payment.status.toLowerCase();

    if (payment.status?.toLowerCase() === "approved") {
      if (!["proposta", "pending", "pendente"].includes(statusReserva)) {
        return `Não é possível confirmar reserva com status: ${statusReserva}`;
      }

      payment.status = "confirmed";
      await this.paymentDAO.update(payment);
    }

    if (
      payment.status?.toLowerCase() === "denied" &&
      statusReserva === "pending"
    ) {
      payment.status = "cancelled";
      await this.paymentDAO.update(payment);
    }

    if (payment.status?.toLowerCase() === "refunded") {
      payment.status = "cancelled";
      await this.paymentDAO.update(payment);

      console.log(
        `🔄 Reserva ${reservaAtual.codeReservation} cancelada - estorno realizado`
      );
    }

    return undefined;
  }

  private async buscarReservaNoBanco(
    reservaId: string
  ): Promise<Reservation | null> {
    try {
      const reservas = await this.reservationDAO.list(
        { id: reservaId } as Reservation,
        "findByReservation"
      );
      return reservas[0] || null;
    } catch (error) {
      console.error("Erro ao buscar reserva:", error);
      return null;
    }
  }

  public async buscarPagamentoDaReserva(
    reservaId: string
  ): Promise<Payment | null> {
    try {
      const pagamentos = await this.paymentDAO.list(
        { reservation: { id: reservaId } } as Payment,
        "findByReservation"
      );
      return pagamentos[0] || null;
    } catch (error) {
      console.error("Erro ao buscar pagamento:", error);
      return null;
    }
  }

  async confirmReservation(
    reservaId: string
  ): Promise<{ confirm: boolean; motivo?: string }> {
    const reserva = await this.reservationDAO.list(
      { id: reservaId } as Reservation,
      "findByReservation"
    );

    if (!reserva) {
      return { confirm: false, motivo: "Reserva não encontrada" };
    }

    const payment = await this.buscarPagamentoDaReserva(reservaId);
    if (!payment) {
      return {
        confirm: false,
        motivo: "Pagamento não encontrado para esta reserva",
      };
    }

    const statusReserva = payment.status.toLowerCase();

    if (!["proposta", "pending", "pendente"].includes(statusReserva)) {
      return {
        confirm: false,
        motivo: `Reserva com status inválido: ${statusReserva}`,
      };
    }

    return { confirm: true };
  }
}
