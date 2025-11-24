// src/controllers/ReportController.ts
import { Request, Response } from "express";
import Facade from "../../facade/Facade";
import Reservation from "../../entities/reservation";
import Payment from "../../entities/payment";
import Room from "../../entities/room";
import Guest from "../../entities/guest";
import Sale from "../../entities/sale";

export class ReportController {
    constructor(private readonly facade: Facade) {}

    public async relatorioOcupacao(req: Request, res: Response): Promise<void> {
        try {
            // RF0231: Relatório de ocupação por período e por tipo de quarto
            const { startDate, endDate, roomType } = req.query;

            const reservations = await this.facade.list({} as Reservation, 'findAll') as Reservation[];
            const rooms = await this.facade.list({} as Room, 'findAll') as Room[];

            // Filtrar por período se fornecido
            let reservasFiltradas = reservations;
            if (startDate && endDate) {
                const start = new Date(startDate as string);
                const end = new Date(endDate as string);
                reservasFiltradas = reservations.filter(r => 
                    r.dateStart >= start && r.dateEnd <= end
                );
            }

            // Filtrar por tipo de quarto se fornecido
            if (roomType) {
                reservasFiltradas = reservasFiltradas.filter(r => 
                    r.room.type === roomType
                );
            }

            // Calcular métricas de ocupação
            const totalQuartos = rooms.length;
            const quartosOcupados = new Set(reservasFiltradas.map(r => r.room.id)).size;
            const taxaOcupacao = totalQuartos > 0 ? (quartosOcupados / totalQuartos) * 100 : 0;

            const relatorio = {
                periodo: {
                    inicio: startDate || 'Todo período',
                    fim: endDate || 'Todo período'
                },
                metricas: {
                    totalQuartos,
                    quartosOcupados,
                    quartosDisponiveis: totalQuartos - quartosOcupados,
                    taxaOcupacao: Number(taxaOcupacao.toFixed(2)) + '%',
                    totalReservas: reservasFiltradas.length,
                    diariasVendidas: this.calcularTotalDiarias(reservasFiltradas)
                },
                ocupacaoPorTipo: this.calcularOcupacaoPorTipo(rooms, reservasFiltradas),
                tendenciaMensal: this.calcularTendenciaMensal(reservations)
            };

            res.status(200).json({
                success: true,
                relatorio
            });

        } catch (error) {
            const err = error as Error;
            res.status(400).json({ 
                success: false,
                error: err.message 
            });
        }
    }

    public async relatorioFinanceiro(req: Request, res: Response): Promise<void> {
        try {
            // RF0232: Relatório financeiro por período e forma de pagamento
            const { startDate, endDate, paymentMethod } = req.query;

            const payments = await this.facade.list({} as Payment, 'findAll') as Payment[];

            // Filtrar apenas pagamentos confirmados/aprovados
            let pagamentosFiltrados = payments.filter(p => 
                p.status === 'approved' || p.status === 'confirmed'
            );

            // Filtrar por período
            if (startDate && endDate) {
                const start = new Date(startDate as string);
                const end = new Date(endDate as string);
                pagamentosFiltrados = pagamentosFiltrados.filter(p => 
                    p.paymentDate >= start && p.paymentDate <= end
                );
            }

            // Filtrar por método de pagamento
            if (paymentMethod) {
                pagamentosFiltrados = pagamentosFiltrados.filter(p => 
                    p.type === paymentMethod
                );
            }

            const receitaTotal = pagamentosFiltrados.reduce((sum, p) => sum + p.price, 0);

            const relatorio = {
                periodo: {
                    inicio: startDate || 'Todo período',
                    fim: endDate || 'Todo período'
                },
                metricas: {
                    receitaTotal: Number(receitaTotal.toFixed(2)),
                    totalPagamentos: pagamentosFiltrados.length,
                    valorMedio: pagamentosFiltrados.length > 0 
                        ? Number((receitaTotal / pagamentosFiltrados.length).toFixed(2))
                        : 0,
                    pagamentosEstornados: payments.filter(p => p.status === 'refunded').length
                },
                porMetodoPagamento: this.agruparPorMetodo(pagamentosFiltrados),
                evolucaoReceita: this.calcularEvolucaoReceita(payments),
                topReservas: await this.calcularTopReservas(pagamentosFiltrados)
            };

            res.status(200).json({
                success: true,
                relatorio
            });

        } catch (error) {
            const err = error as Error;
            res.status(400).json({ 
                success: false,
                error: err.message 
            });
        }
    }

    public async relatorioOrigemReservas(req: Request, res: Response): Promise<void> {
        try {
            // RF0233: Relatório por canal de origem de reservas
            const { startDate, endDate } = req.query;

            const reservations = await this.facade.list({} as Reservation, 'findAll') as Reservation[];

            // Filtrar por período se fornecido
            let reservasFiltradas = reservations;
            if (startDate && endDate) {
                const start = new Date(startDate as string);
                const end = new Date(endDate as string);
                reservasFiltradas = reservations.filter(r => 
                    r.dateStart >= start && r.dateEnd <= end
                );
            }

            // Adicionar canal virtual
            const reservasComCanal = reservasFiltradas.map(r => ({
                ...r,
                canalVirtual: this.determinarCanalVirtual(r)
            }));

            const relatorio = {
                periodo: {
                    inicio: startDate || 'Todo período',
                    fim: endDate || 'Todo período'
                },
                metricas: {
                    totalReservas: reservasFiltradas.length,
                    reservasConfirmadas: reservasFiltradas.filter(r => 
                        r.paymentStatus === 'confirmed' || r.paymentStatus === 'approved'
                    ).length,
                    taxaConfirmacao: reservasFiltradas.length > 0 
                        ? Number((reservasFiltradas.filter(r => 
                            r.paymentStatus === 'confirmed' || r.paymentStatus === 'approved'
                          ).length / reservasFiltradas.length * 100).toFixed(2)) + '%'
                        : '0%'
                },
                porCanal: this.agruparPorCanalVirtual(reservasComCanal),
                porTipoQuarto: this.agruparReservasPorTipoQuarto(reservasFiltradas),
                porTempoAntecedencia: this.agruparPorTempoAntecedencia(reservasFiltradas)
            };

            res.status(200).json({
                success: true,
                relatorio
            });

        } catch (error) {
            const err = error as Error;
            res.status(400).json({ 
                success: false,
                error: err.message 
            });
        }
    }

    public async relatorioDesempenhoPromocoes(req: Request, res: Response): Promise<void> {
        try {
            // RF0234: Desempenho de promoções
            const sales = await this.facade.list({} as Sale, 'findAll') as Sale[];
            const reservations = await this.facade.list({} as Reservation, 'findAll') as Reservation[];

            // Aqui você implementaria a lógica para rastrear uso de promoções
            // Por enquanto, vamos retornar métricas básicas das promoções

            const relatorio = {
                metricas: {
                    totalPromocoes: sales.length,
                    promocoesAtivas: sales.filter(s => s.promoAtiva()).length,
                    promocoesExpiradas: sales.filter(s => !s.promoAtiva()).length,
                    taxaUtilizacao: '0%' // Seria calculado com base no uso real
                },
                promocoes: sales.map(sale => ({
                    codigo: sale.codigoSale,
                    descricao: sale.description,
                    tipo: sale.tipo,
                    valor: sale.valor,
                    status: sale.promoAtiva() ? 'Ativa' : 'Expirada',
                    validoAte: sale.validoAte
                })),
                sugestoes: this.gerarSugestoesPromocao(sales, reservations)
            };

            res.status(200).json({
                success: true,
                relatorio
            });

        } catch (error) {
            const err = error as Error;
            res.status(400).json({ 
                success: false,
                error: err.message 
            });
        }
    }

    // Métodos auxiliares para cálculos
    private determinarCanalVirtual(reservation: Reservation): string {
        // Lógica para determinar canal baseado em características da reserva
        
        // Reservas com crianças - Canal "Família"
        if (reservation.qntChildren > 0) return 'Família';
        
        // Reservas de fim de semana - Canal "Lazer"
        const isWeekend = reservation.dateStart.getDay() === 0 || reservation.dateStart.getDay() === 6;
        if (isWeekend) return 'Lazer';
        
        // Reservas com preço baixo - Canal "Promocional"
        if (reservation.priceTotal < 150) return 'Promocional';
        
        // Reservas longas (+7 dias) - Canal "Estadia Longa"
        const diffTime = Math.abs(reservation.dateEnd.getTime() - reservation.dateStart.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 7) return 'Estadia Longa';
        
        // Padrão - Canal "Direto"
        return 'Direto';
    }

    private agruparPorCanalVirtual(reservasComCanal: any[]): any {
        return reservasComCanal.reduce((acc, r) => {
            const canal = r.canalVirtual;
            acc[canal] = (acc[canal] || 0) + 1;
            return acc;
        }, {} as any);
    }

    private calcularOcupacaoPorTipo(rooms: Room[], reservations: Reservation[]): any {
        const tipos = rooms.map(r => r.type).filter((v, i, a) => a.indexOf(v) === i);
        
        return tipos.reduce((acc, tipo) => {
            const quartosDoTipo = rooms.filter(r => r.type === tipo).length;
            const reservasDoTipo = reservations.filter(r => r.room.type === tipo);
            const quartosOcupados = new Set(reservasDoTipo.map(r => r.room.id)).size;
            
            acc[tipo] = {
                totalQuartos: quartosDoTipo,
                quartosOcupados,
                taxaOcupacao: quartosDoTipo > 0 
                    ? Number((quartosOcupados / quartosDoTipo * 100).toFixed(2)) + '%'
                    : '0%',
                totalReservas: reservasDoTipo.length
            };
            return acc;
        }, {} as any);
    }

    private calcularTotalDiarias(reservations: Reservation[]): number {
        return reservations.reduce((total, r) => {
            const diffTime = Math.abs(r.dateEnd.getTime() - r.dateStart.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return total + diffDays;
        }, 0);
    }

    private agruparPorMetodo(payments: Payment[]): any {
        return payments.reduce((acc, p) => {
            const metodo = p.type;
            if (!acc[metodo]) {
                acc[metodo] = { quantidade: 0, valorTotal: 0 };
            }
            acc[metodo].quantidade += 1;
            acc[metodo].valorTotal += p.price;
            return acc;
        }, {} as any);
    }

    private agruparReservasPorTipoQuarto(reservations: Reservation[]): any {
        return reservations.reduce((acc, r) => {
            const tipo = r.room.type;
            acc[tipo] = (acc[tipo] || 0) + 1;
            return acc;
        }, {} as any);
    }

    private agruparPorTempoAntecedencia(reservations: Reservation[]): any {
        const hoje = new Date();
        return reservations.reduce((acc, r) => {
            const diffTime = Math.abs(r.dateStart.getTime() - hoje.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            let faixa = '';
            if (diffDays <= 7) faixa = 'Última hora (1-7 dias)';
            else if (diffDays <= 30) faixa = 'Curto prazo (8-30 dias)';
            else if (diffDays <= 90) faixa = 'Médio prazo (1-3 meses)';
            else faixa = 'Longo prazo (+3 meses)';
            
            acc[faixa] = (acc[faixa] || 0) + 1;
            return acc;
        }, {} as any);
    }

    private calcularTendenciaMensal(reservations: Reservation[]): any {
        // Agrupar reservas por mês
        const porMes = reservations.reduce((acc, r) => {
            const mes = r.dateStart.toISOString().substring(0, 7); // YYYY-MM
            acc[mes] = (acc[mes] || 0) + 1;
            return acc;
        }, {} as any);

        return porMes;
    }

    private calcularEvolucaoReceita(payments: Payment[]): any {
        const pagamentosAprovados = payments.filter(p => 
            p.status === 'approved' || p.status === 'confirmed'
        );

        return pagamentosAprovados.reduce((acc, p) => {
            const mes = p.paymentDate.toISOString().substring(0, 7); // YYYY-MM
            if (!acc[mes]) {
                acc[mes] = { receita: 0, quantidade: 0 };
            }
            acc[mes].receita += p.price;
            acc[mes].quantidade += 1;
            return acc;
        }, {} as any);
    }

    private async calcularTopReservas(payments: Payment[]): Promise<any[]> {
        // Agrupar por reserva e ordenar por valor
        const porReserva = payments.reduce((acc, p) => {
            const reservaId = p.reservation.id;
            if (!acc[reservaId]) {
                acc[reservaId] = {
                    reserva: p.reservation,
                    valorTotal: 0
                };
            }
            acc[reservaId].valorTotal += p.price;
            return acc;
        }, {} as any);

        return Object.values(porReserva)
            .sort((a: any, b: any) => b.valorTotal - a.valorTotal)
            .slice(0, 10); // Top 10
    }

    private gerarSugestoesPromocao(sales: Sale[], reservations: Reservation[]): string[] {
        const sugestoes: string[] = [];
        
        // Analisar padrões para gerar sugestões
        const reservasComCriancas = reservations.filter(r => r.qntChildren > 0).length;
        if (reservasComCriancas > 10) {
            sugestoes.push("Considere criar promoções familiares com desconto para crianças");
        }

        const reservasFimSemana = reservations.filter(r => {
            const dia = r.dateStart.getDay();
            return dia === 0 || dia === 6;
        }).length;

        if (reservasFimSemana < reservasComCriancas) {
            sugestoes.push("Promoções de fim de semana podem aumentar a ocupação");
        }

        return sugestoes.length > 0 ? sugestoes : ["Não há sugestões no momento"];
    }
}