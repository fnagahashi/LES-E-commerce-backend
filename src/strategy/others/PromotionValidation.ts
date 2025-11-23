import IStrategy from "../IStrategy";
import Reservation from "../../entities/reservation";
import Sale from "../../entities/sale";
import SaleDAO from "../../DAO/Interface/SaleDAO";

export default class PromotionValidation implements IStrategy<Reservation> {
    constructor(private readonly saleDAO: SaleDAO) {}

    async executar(reservation: Reservation & { codigoPromocao?: string }): Promise<string | undefined> {
        if (!reservation.codigoPromocao) {
            return undefined;
        }

        const promocao = await this.buscarPromocaoNoBanco(reservation.codigoPromocao);
        
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
            return `Promoção inválida: ${errors.join(', ')}`;
        }

        this.aplicarDesconto(reservation, promocao);

        return undefined;
    }

    private async buscarPromocaoNoBanco(codigo: string): Promise<Sale | undefined> {
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

    private calcularDias(reservation: Reservation): number {
        const diffTime = reservation.dateEnd.getTime() - reservation.dateStart.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    private aplicarDesconto(reservation: Reservation, promocao: Sale): void {
        const dias = this.calcularDias(reservation);
        const desconto = promocao.calcularDesconto(reservation.priceTotal, dias);
        
        if (desconto > 0) {
            const novoPrecoTotal = Math.max(reservation.priceTotal - desconto, 0);
            reservation.priceTotal = novoPrecoTotal;
        }
    }

    async obterDetalhesPromocao(codigoPromocao: string, reservation: Reservation): Promise<{
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


        const dias = this.calcularDias(reservation);
        const desconto = promocao.calcularDesconto(reservation.priceTotal, dias);

        return {
            promocao,
            desconto,
            valido: erros.length === 0,
            erros
        };
    }
}