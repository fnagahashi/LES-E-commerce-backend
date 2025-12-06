import IStrategy from "../IStrategy";
import Reservation from "../../entities/reservation";

export default class ValidationAvailabilityRoom
  implements IStrategy<Reservation>
{
  constructor(private readonly reservationDAO: any) {}

  async executar(reservation: Reservation): Promise<string | undefined> {
    if (!reservation.roomId || !reservation.dateStart || !reservation.dateEnd) {
      return "Dados insuficientes para validar disponibilidade";
    }

    try {
      const criteriosBusca = {
        roomId: reservation.roomId,
        dateStart: reservation.dateStart,
        dateEnd: reservation.dateEnd,
      };

      const reservasConflitantes = await this.reservationDAO.list(
        criteriosBusca,
        "buscarPorDatasEQuarto"
      );

      const reservasOcupantes = reservasConflitantes.filter(
        (r) => r.id !== reservation.id && this.isQuartoOcupado(r.status)
      );

      if (reservasOcupantes.length > 0) {
        return "Quarto não disponível nas datas solicitadas";
      }

      return undefined;
    } catch (error) {}
  }

  private isQuartoOcupado(isActive: boolean) {
    const statusOcupantes = [true];
    return statusOcupantes.includes(isActive);
  }
}
