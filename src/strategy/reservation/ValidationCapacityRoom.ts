import IStrategy from "../IStrategy";
import Reservation from "../../entities/reservation";
import { RoomType } from "../../enum/RoomType";

export default class ValidationCapacityRoom implements IStrategy<Reservation> {
  async executar(reservation: Reservation): Promise<string | undefined> {
    const errors: string[] = [];
    const room = reservation.roomId.toString() as RoomType;

    if (this.isQuartoPadrao(room)) {
      if (reservation.qntAdults > 2) {
        errors.push("Quartos padrão suportam no máximo 2 adultos");
      }
      if (reservation.qntChildren > 2) {
        errors.push("Quartos padrão suportam no máximo 2 crianças");
      }
    }

    if (this.isSuite(room) && reservation.qntAdults > 4) {
      errors.push("Suítes suportam no máximo 4 adultos");
    }

    return errors.length > 0 ? errors.join("; ") : undefined;
  }

  private isQuartoPadrao(tipo: string): boolean {
    const tiposPadrao = ["single", "double", "suite"];
    return tiposPadrao.includes(tipo?.toLowerCase());
  }

  private isSuite(tipo: string): boolean {
    const tiposSuite = ["suite"];
    return tiposSuite.includes(tipo?.toLowerCase());
  }
}
