import IStrategy from "../IStrategy";
import Reservation from "../../entities/reservation";
import Room from "../../entities/room";
import RoomDAO from "../../DAO/Interface/RoomDAO";

export default class ValidationCapacity implements IStrategy<Reservation> {
  constructor(private readonly roomDAO: any) {}
  async executar(reservation: Reservation): Promise<string | undefined> {
    if (
      !reservation.roomId ||
      reservation.qntAdults === undefined ||
      reservation.qntChildren === undefined
    ) {
      return "Dados insuficientes para validar capacidade";
    }

    const errors: string[] = [];
    const id = reservation.roomId;
    console.log("ID do quarto na validação de capacidade:", id);
    const rooms = (await this.roomDAO.list(id, "findById")) as Room[];
    console.log("Room encontrado na validação de capacidade:", rooms);

    const totalHospedes = reservation.qntAdults + reservation.qntChildren;
    const capacidadeTotal =
      (rooms[0].qntdAdultos || 0) + (rooms[0].qntdCriancas || 0);
    console.log("Quantidade adultos do quarto:", rooms[0].qntdAdultos);
    console.log("Quantidade crianças do quarto:", rooms[0].qntdCriancas);
    console.log("Capacidade total do quarto:", capacidadeTotal);
    console.log("Total de hóspedes na reserva:", totalHospedes);

    if (totalHospedes > capacidadeTotal) {
      errors.push(
        `Capacidade total excedida: quarto suporta ${capacidadeTotal} pessoas`
      );
    }

    if (reservation.qntAdults > (rooms[0].qntdAdultos || 0)) {
      errors.push(
        `Máximo de adultos excedido: ${rooms[0].qntdAdultos} permitidos`
      );
    }

    if (reservation.qntChildren > (rooms[0].qntdCriancas || 0)) {
      errors.push(
        `Máximo de crianças excedido: ${rooms[0].qntdCriancas} permitidas`
      );
    }

    return errors.length > 0 ? errors.join("; ") : undefined;
  }
}
