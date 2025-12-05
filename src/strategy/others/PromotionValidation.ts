import IStrategy from "../IStrategy";
import Reservation from "../../entities/reservation";
import Sale from "../../entities/sale";
import SaleDAO from "../../DAO/Interface/SaleDAO";
import Payment from "../../entities/payment";
import PaymentDAO from "../../DAO/Interface/PaymentDAO";

export default class PromotionValidation implements IStrategy<Reservation> {
  constructor(private readonly saleDAO: SaleDAO, private readonly paymentDAO: PaymentDAO) {}

  async executar(
    reservation: Reservation & { codigoPromocao?: string }
  ): Promise<string | undefined> {
    if (!reservation.codigoPromocao) {
      return undefined;
    }

    const promocao = await this.buscarPromocaoNoBanco(
      reservation.codigoPromocao
    );

    if (!promocao) {
      return `Promoção "${reservation.codigoPromocao}" não encontrada`;
    }

    const errors: string[] = [];
    if (!promocao.promoAtiva()) {
      errors.push("Promoção expirada ou inativa");
    }

    if (!promocao.acumulativa) {
      return "Promoção não cumulativa - removendo outras promoções se existirem";
    }

    if (errors.length > 0) {
      return `Promoção inválida: ${errors.join(", ")}`;
    }
    const payment = await this.buscarPagamentoDaReserva(reservation.id);
    
    if (!payment) {
      return "Pagamento não encontrado para esta reserva";
    }

    this.aplicarDesconto(reservation, promocao, payment);

    return undefined;
  }

  private async buscarPromocaoNoBanco(
    codigo: string
  ): Promise<Sale | undefined> {
    try {
      const promocoes = await this.saleDAO.list(
        { codigoSale: codigo, ativa: true } as Sale,
        "buscarPorCodigo"
      );
      return promocoes[0];
    } catch (error) {
      console.error("Erro ao buscar promoção:", error);
      return undefined;
    }
  }

 private async buscarPagamentoDaReserva(reservationId: string): Promise<Payment | undefined> {
    if (!this.paymentDAO) {
      throw new Error("Repositório de pagamento não disponível");
    }
    
    try {

      const pagamentos = await this.paymentDAO.list(
        { reservation: { id: reservationId } } as Payment,
        "findByReservation"
      );
      return pagamentos[0];
    } catch (error) {
      console.error("Erro ao buscar pagamento:", error);
      return undefined;
    }
  }

  private calcularDias(reservation: Reservation): number {
    const diffTime =
      reservation.dateEnd.getTime() - reservation.dateStart.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private async aplicarDesconto(reservation: Reservation, promocao: Sale, payment: Payment): Promise<void> {
    if (!promocao.promoAtiva()) {
      throw new Error("Promoção não está ativa");
    }
  }

  async obterDetalhesPromocao(
    codigoPromocao: string,
    reservation: Reservation
  ): Promise<{
    promocao: Sale | undefined;
    desconto: number;
    valido: boolean;
    erros: string[];
  }> {
    const promocao = await this.buscarPromocaoNoBanco(codigoPromocao);
    const erros: string[] = [];

    if (!promocao) {
      erros.push("Promoção não encontrada");
      return { promocao: undefined, desconto: 0, valido: false, erros };
    }

    if (!promocao.promoAtiva()) {
      erros.push("Promoção expirada ou inativa");
    }

    const payment = await this.buscarPagamentoDaReserva(reservation.id);
    if (!payment) {
      erros.push("Pagamento não encontrado para esta reserva");
      return { promocao: undefined, desconto: 0, valido: false, erros };
    }

    const dias = this.calcularDias(reservation);
    const desconto = promocao.calcularDesconto(payment.price, dias);

    return {
      promocao,
      desconto,
      valido: erros.length === 0,
      erros,
    };
  }
}
