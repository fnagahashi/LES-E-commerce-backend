// src/controllers/SaleController.ts
import { Request, Response } from "express";
import Facade from "../../facade/Facade";
import Sale, { TipoPromocao } from "../../entities/sale";

export class SaleController {
    constructor(private readonly facade: Facade) {}

    public async criar(req: Request, res: Response): Promise<void> {
        try {
            // RF0121: Cadastrar promoção
            const sale = await this.definirSaleCriar(req);
            
            const saleSalva = await this.facade.create(sale);
            
            res.status(201).json({ 
                success: true,
                message: "Promoção criada com sucesso",
                sale: saleSalva 
            });

        } catch (error) {
            const err = error as Error;
            res.status(400).json({
                success: false,
                error: err.message
            });
        }
    }

    private async definirSaleCriar(req: Request): Promise<Sale> {
        const {
            codigoSale,
            description,
            tipo,
            valor,
            validoAte,
            acumulativa = false,
            ativa = true
        } = req.body;

        return new Sale(
            codigoSale,
            description,
            tipo as TipoPromocao,
            parseFloat(valor),
            new Date(validoAte),
            acumulativa,
            ativa
        );
    }

    private async definirSaleAtualizar(req: Request): Promise<Sale> {
        const {
            codigoSale,
            description,
            tipo,
            valor,
            validoAte,
            acumulativa,
            ativa
        } = req.body;

        return new Sale(
            codigoSale,
            description,
            tipo as TipoPromocao,
            valor ? parseFloat(valor) : undefined,
            validoAte ? new Date(validoAte) : undefined,
            acumulativa,
            ativa
        );
    }

    private async definirSaleFiltrar(req: Request): Promise<Partial<Sale>> {
        const {
            codigoSale,
            description,
            tipo,
            ativa,
            validoAte,
            vigentes // filtro especial para promoções vigentes
        } = req.query;

        const filters: Partial<Sale> = {};

        if (codigoSale) filters.codigoSale = codigoSale as string;
        if (description) filters.description = description as string;
        if (tipo) filters.tipo = tipo as TipoPromocao;
        if (ativa !== undefined) filters.ativa = ativa === 'true';
        if (validoAte) filters.validoAte = new Date(validoAte as string);

        // Filtro especial para promoções vigentes
        if (vigentes === 'true') {
            filters.validoAte = new Date(); // Data atual para comparação
            filters.ativa = true;
        }

        return filters;
    }

    public async buscarTodas(req: Request, res: Response): Promise<void> {
        try {
            // RF0124: Consultar promoções
            const sales = await this.facade.list({} as Sale, 'findAll') as Sale[];
            
            res.status(200).json({
                success: true,
                count: sales.length,
                sales
            });

        } catch (error) {
            const err = error as Error;
            res.status(400).json({
                success: false,
                error: err.message
            });
        }
    }

    public async buscarVigentes(req: Request, res: Response): Promise<void> {
        try {
            // RF0124: Consultar promoções vigentes
            const sales = await this.facade.list(
                { 
                    ativa: true,
                    validoAte: new Date() // Promoções que ainda são válidas
                } as Sale, 
                'findByFilters'
            ) as Sale[];
            
            // Filtrar apenas as que estão realmente ativas (validação extra)
            const salesVigentes = sales.filter(sale => sale.promoAtiva());
            
            res.status(200).json({
                success: true,
                count: salesVigentes.length,
                sales: salesVigentes
            });

        } catch (error) {
            const err = error as Error;
            res.status(400).json({
                success: false,
                error: err.message
            });
        }
    }

    public async buscarPorFiltro(req: Request, res: Response): Promise<void> {
        try {
            const filters = await this.definirSaleFiltrar(req);
            const sales = await this.facade.list(filters as Sale, 'findByFilters') as Sale[];
            
            res.status(200).json({
                success: true,
                count: sales.length,
                sales
            });

        } catch (error) {
            const err = error as Error;
            res.status(400).json({
                success: false,
                error: err.message
            });
        }
    }

    public async buscarPorId(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            
            const sales = await this.facade.list({ id } as Sale, 'findById') as Sale[];
            
            if (sales.length === 0) {
                res.status(404).json({
                    success: false,
                    error: "Promoção não encontrada"
                });
                return;
            }

            res.status(200).json({
                success: true,
                sale: sales[0]
            });

        } catch (error) {
            const err = error as Error;
            res.status(400).json({
                success: false,
                error: err.message
            });
        }
    }

    public async buscarPorCodigo(req: Request, res: Response): Promise<void> {
        try {
            const { codigoSale } = req.params;
            
            const sales = await this.facade.list({ codigoSale } as Sale, 'findByFilters') as Sale[];
            
            if (sales.length === 0) {
                res.status(404).json({
                    success: false,
                    error: "Promoção não encontrada"
                });
                return;
            }

            res.status(200).json({
                success: true,
                sale: sales[0]
            });

        } catch (error) {
            const err = error as Error;
            res.status(400).json({
                success: false,
                error: err.message
            });
        }
    }

    public async atualizar(req: Request, res: Response): Promise<void> {
        try {
            // RF0122: Alterar promoção
            const { id } = req.params;
            
            // Buscar a promoção atual
            const sales = await this.facade.list({ id } as Sale, 'findById') as Sale[];
            
            if (sales.length === 0) {
                res.status(404).json({
                    success: false,
                    error: "Promoção não encontrada"
                });
                return;
            }

            const saleAtual = sales[0];
            const dadosAtualizacao = await this.definirSaleAtualizar(req);
            
            // Mesclar os dados mantendo o ID
            const saleAtualizada = new Sale(
                dadosAtualizacao.codigoSale || saleAtual.codigoSale,
                dadosAtualizacao.description || saleAtual.description,
                dadosAtualizacao.tipo || saleAtual.tipo,
                dadosAtualizacao.valor ?? saleAtual.valor,
                dadosAtualizacao.validoAte || saleAtual.validoAte,
                dadosAtualizacao.acumulativa ?? saleAtual.acumulativa,
                dadosAtualizacao.ativa ?? saleAtual.ativa
            );
            saleAtualizada.id = saleAtual.id;

            const resultado = await this.facade.update(saleAtualizada);

            res.status(200).json({
                success: true,
                message: "Promoção atualizada com sucesso",
                sale: resultado
            });

        } catch (error) {
            const err = error as Error;
            res.status(400).json({
                success: false,
                error: err.message
            });
        }
    }

    public async inativar(req: Request, res: Response): Promise<void> {
        try {
            // RF0123: Inativar promoção
            const { id } = req.params;

            const sales = await this.facade.list({ id } as Sale, 'findById') as Sale[];
            
            if (sales.length === 0) {
                res.status(404).json({
                    success: false,
                    error: "Promoção não encontrada"
                });
                return;
            }

            const saleAtual = sales[0];

            const saleAtualizada = new Sale(
                saleAtual.codigoSale,
                saleAtual.description,
                saleAtual.tipo,
                saleAtual.valor,
                saleAtual.validoAte,
                saleAtual.acumulativa,
                false // ativa = false
            );
            saleAtualizada.id = saleAtual.id;

            const resultado = await this.facade.update(saleAtualizada);

            res.status(200).json({
                success: true,
                message: "Promoção inativada com sucesso",
                sale: resultado
            });

        } catch (error) {
            const err = error as Error;
            res.status(400).json({
                success: false,
                error: err.message
            });
        }
    }

    public async ativar(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const sales = await this.facade.list({ id } as Sale, 'findById') as Sale[];
            
            if (sales.length === 0) {
                res.status(404).json({
                    success: false,
                    error: "Promoção não encontrada"
                });
                return;
            }

            const saleAtual = sales[0];

            const saleAtualizada = new Sale(
                saleAtual.codigoSale,
                saleAtual.description,
                saleAtual.tipo,
                saleAtual.valor,
                saleAtual.validoAte,
                saleAtual.acumulativa,
                true // ativa = true
            );
            saleAtualizada.id = saleAtual.id;

            const resultado = await this.facade.update(saleAtualizada);

            res.status(200).json({
                success: true,
                message: "Promoção ativada com sucesso",
                sale: resultado
            });

        } catch (error) {
            const err = error as Error;
            res.status(400).json({
                success: false,
                error: err.message
            });
        }
    }

    public async calcularDesconto(req: Request, res: Response): Promise<void> {
        try {
            const { codigoSale } = req.params;
            const { valorTotal, diarias } = req.body;

            // Buscar a promoção
            const sales = await this.facade.list({ codigoSale } as Sale, 'findByFilters') as Sale[];
            
            if (sales.length === 0) {
                res.status(404).json({
                    success: false,
                    error: "Promoção não encontrada"
                });
                return;
            }

            const sale = sales[0];

            // Validar se a promoção está ativa
            if (!sale.promoAtiva()) {
                res.status(400).json({
                    success: false,
                    error: "Promoção não está ativa ou expirou"
                });
                return;
            }

            // Calcular desconto usando o método da entidade
            const desconto = sale.calcularDesconto(valorTotal, diarias);
            const valorFinal = valorTotal - desconto;

            res.status(200).json({
                success: true,
                message: "Cálculo de desconto realizado com sucesso",
                originalPrice: valorTotal,
                discountedPrice: valorFinal,
                discount: desconto,
                sale: sale
            });

        } catch (error) {
            const err = error as Error;
            res.status(400).json({
                success: false,
                error: err.message
            });
        }
    }

    public async verificarDisponibilidade(req: Request, res: Response): Promise<void> {
        try {
            const { codigoSale } = req.params;
            
            const sales = await this.facade.list({ codigoSale } as Sale, 'findByFilters') as Sale[];
            
            if (sales.length === 0) {
                res.status(404).json({
                    success: false,
                    error: "Promoção não encontrada"
                });
                return;
            }

            const sale = sales[0];
            const estaAtiva = sale.promoAtiva();

            res.status(200).json({
                success: true,
                available: estaAtiva,
                sale: sale,
                message: estaAtiva ? "Promoção disponível" : "Promoção não disponível"
            });

        } catch (error) {
            const err = error as Error;
            res.status(400).json({
                success: false,
                error: err.message
            });
        }
    }

    public async getEstatisticas(req: Request, res: Response): Promise<void> {
        try {
            // RF0234: Desempenho de promoções
            const sales = await this.facade.list({} as Sale, 'findAll') as Sale[];

            const stats = {
                total: sales.length,
                ativas: sales.filter(s => s.ativa).length,
                inativas: sales.filter(s => !s.ativa).length,
                vigentes: sales.filter(s => s.promoAtiva()).length,
                porTipo: this.agruparPorTipo(sales),
                acumulativas: sales.filter(s => s.acumulativa).length,
                expiradas: sales.filter(s => s.validoAte < new Date()).length
            };

            res.status(200).json({
                success: true,
                stats
            });

        } catch (error) {
            const err = error as Error;
            res.status(400).json({
                success: false,
                error: err.message
            });
        }
    }

    private agruparPorTipo(sales: Sale[]): { [tipo: string]: number } {
        return sales.reduce((acc, sale) => {
            const tipo = sale.tipo;
            acc[tipo] = (acc[tipo] || 0) + 1;
            return acc;
        }, {} as { [tipo: string]: number });
    }
}