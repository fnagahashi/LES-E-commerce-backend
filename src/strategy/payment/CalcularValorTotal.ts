import IStrategy from "../IStrategy";
import Reservation from "../../entities/reservation";
import Sale from "../../entities/sale";
import Payment from "../../entities/payment";
import RoomDAO from "../../DAO/Interface/RoomDAO";
import Room from "../../entities/room";
import { RoomType } from "../../enum/RoomType";

export default class CalcularValorTotal implements IStrategy<Payment> {
  constructor(private readonly roomDAO: RoomDAO) {}
  async executar(payment: Payment): Promise<string | undefined> {
    const reservation = payment.reservation;
    if (!reservation) {
      return "Reserva é necessária para calcular o valor total";
    }
    const reserva = reservation as Reservation;

    if (!reserva.dateStart || !reserva.dateEnd) {
      return "Datas de início e fim da reserva são necessárias para calcular o valor total";
    }
    const dataInicio = new Date(reserva.dateStart);
    const dataFim = new Date(reserva.dateEnd);
    const diferencaTempo = dataFim.getTime() - dataInicio.getTime();
    const diferencaDias = Math.ceil(diferencaTempo / (1000 * 3600 * 24));
    if (diferencaDias <= 0) {
      return "A data de fim da reserva deve ser posterior à data de início";
    }

    const roomParam = new Room("", RoomType.single, 0, 0, 0, true);
    (roomParam as any).id = reservation.roomId;

    const rooms = await this.roomDAO.list(roomParam, "findById");
    const room = rooms[0];

    const valorTotal = room.precoBase * diferencaDias;
    payment.price = valorTotal;

    const promocao = reserva.sale as Sale;

    if (promocao) {
      if (!promocao.promoAtiva?.()) {
        return `Promoção "${promocao.codigoSale}" não está ativa`;
      }
      const desconto = promocao.calcularDesconto(valorTotal, diferencaDias);
      const valorComDesconto = valorTotal - desconto;
      payment.price = valorComDesconto;
      return valorComDesconto.toString();
    }
    return undefined;
  }
}
