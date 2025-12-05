import IStrategy from "../IStrategy";
import Reservation from "../../entities/reservation";
import Payment from "../../entities/payment";
import Room from "../../entities/room";
import Sale from "../../entities/sale";

export default class CalcularValorTotal implements IStrategy<Payment> {
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

    const room = reserva.room as Room;

    const precoDiaria = room.precoBase;
    const valorTotal = precoDiaria * diferencaDias;

    const promocao = reserva.sale as Sale;

    if (promocao) {
      if (!promocao.promoAtiva?.()) {
          return `Promoção "${promocao.codigoSale}" não está ativa`;
      }
      const desconto = promocao.calcularDesconto(valorTotal, diferencaDias);
      payment.price = valorTotal - desconto;
      return (valorTotal - desconto).toString();
    }

    payment.price = valorTotal;
    return valorTotal.toString();
  }
}
