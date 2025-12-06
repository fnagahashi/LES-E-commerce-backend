import IStrategy from "../IStrategy";
import Reservation from "../../entities/reservation";

export default class ValidationRequiredReservationFields
  implements IStrategy<Reservation>
{
  async executar(reservation: Reservation): Promise<string> {
    const errors: string[] = [];

    if (!reservation.guestId) errors.push("Hóspede é obrigatório");
    if (!reservation.roomId) errors.push("Quarto é obrigatório");
    if (!reservation.dateStart) errors.push("Data de início é obrigatória");
    if (!reservation.dateEnd) errors.push("Data de término é obrigatória");
    if (reservation.qntAdults === undefined || reservation.qntAdults === null)
      errors.push("Quantidade de adultos é obrigatória");
    if (
      reservation.qntChildren === undefined ||
      reservation.qntChildren === null
    )
      errors.push("Quantidade de crianças é obrigatória");

    return errors.length > 0 ? errors.join(", ") : undefined;
  }
}
