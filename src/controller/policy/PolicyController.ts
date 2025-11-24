// src/controllers/PolicyController.ts
import { Request, Response } from "express";
import Facade from "../../facade/Facade";
import Policy from "../../entities/policy";

export class PolicyController {
    constructor(private readonly facade: Facade) {}

    public async criar(req: Request, res: Response): Promise<void> {
        try {
            // RF0131: Cadastrar política de cancelamento
            const policy = await this.definirPolicyCriar(req);
            
            const policySalva = await this.facade.create(policy);
            
            res.status(201).json({ 
                success: true,
                message: "Política de cancelamento criada com sucesso",
                policy: policySalva 
            });

        } catch (error) {
            const err = error as Error;
            res.status(400).json({
                success: false,
                error: err.message
            });
        }
    }

    private async definirPolicyCriar(req: Request): Promise<Policy> {
        const {
            description,
            percentual
        } = req.body;

        return new Policy(
            description,
            parseFloat(percentual)
        );
    }

    private async definirPolicyAtualizar(req: Request): Promise<Policy> {
        const {
            description,
            percentual
        } = req.body;

        return new Policy(
            description,
            parseFloat(percentual)
        );
    }

    private async definirPolicyFiltrar(req: Request): Promise<Partial<Policy>> {
        const {
            description,
            percentualMin,
            percentualMax
        } = req.query;

        const filters: Partial<Policy> = {};

        if (description) filters.description = description as string;

        // Filtros adicionais para percentual
        if (percentualMin || percentualMax) {
            (filters as any).percentualRange = {
                min: percentualMin ? parseFloat(percentualMin as string) : undefined,
                max: percentualMax ? parseFloat(percentualMax as string) : undefined
            };
        }

        return filters;
    }

    public async buscarTodas(req: Request, res: Response): Promise<void> {
        try {
            // RF0134: Consultar políticas de cancelamento
            const policies = await this.facade.list({} as Policy, 'findAll') as Policy[];
            
            res.status(200).json({
                success: true,
                count: policies.length,
                policies
            });

        } catch (error) {
            const err = error as Error;
            res.status(400).json({
                success: false,
                error: err.message
            });
        }
    }

    public async buscarAtivas(req: Request, res: Response): Promise<void> {
        try {
            // Buscar políticas não deletadas (ativas)
            const policies = await this.facade.list({} as Policy, 'findAll') as Policy[];
            
            // Filtrar políticas não deletadas (deletedAt é null)
            const policiesAtivas = policies.filter(policy => !policy.deletedAt);
            
            res.status(200).json({
                success: true,
                count: policiesAtivas.length,
                policies: policiesAtivas
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
            const filters = await this.definirPolicyFiltrar(req);
            const policies = await this.facade.list(filters as Policy, 'findByFilters') as Policy[];
            
            res.status(200).json({
                success: true,
                count: policies.length,
                policies
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
            
            const policies = await this.facade.list({ id } as Policy, 'findById') as Policy[];
            
            if (policies.length === 0) {
                res.status(404).json({
                    success: false,
                    error: "Política de cancelamento não encontrada"
                });
                return;
            }

            res.status(200).json({
                success: true,
                policy: policies[0]
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
            // RF0132: Alterar política de cancelamento
            const { id } = req.params;
            
            // Buscar a política atual
            const policies = await this.facade.list({ id } as Policy, 'findById') as Policy[];
            
            if (policies.length === 0) {
                res.status(404).json({
                    success: false,
                    error: "Política de cancelamento não encontrada"
                });
                return;
            }

            const policyAtual = policies[0];
            const dadosAtualizacao = await this.definirPolicyAtualizar(req);
            
            // Mesclar os dados mantendo o ID
            const policyAtualizada = new Policy(
                dadosAtualizacao.description || policyAtual.description,
                dadosAtualizacao.percentual ?? policyAtual.percentual
            );
            policyAtualizada.id = policyAtual.id;

            const resultado = await this.facade.update(policyAtualizada);

            res.status(200).json({
                success: true,
                message: "Política de cancelamento atualizada com sucesso",
                policy: resultado
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
            // RF0133: Inativar política de cancelamento
            const { id } = req.params;

            const policies = await this.facade.list({ id } as Policy, 'findById') as Policy[];
            
            if (policies.length === 0) {
                res.status(404).json({
                    success: false,
                    error: "Política de cancelamento não encontrada"
                });
                return;
            }

            const policyAtual = policies[0];

            // Para inativar, vamos usar o soft delete (deletedAt)
            const resultado = await this.facade.delete(policyAtual);

            res.status(200).json({
                success: true,
                message: "Política de cancelamento inativada com sucesso",
                policy: resultado
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

            const policies = await this.facade.list({ id } as Policy, 'findById') as Policy[];
            
            if (policies.length === 0) {
                res.status(404).json({
                    success: false,
                    error: "Política de cancelamento não encontrada"
                });
                return;
            }

            const policyAtual = policies[0];

            // Para ativar, precisamos criar uma nova instância sem deletedAt
            const policyAtivada = new Policy(
                policyAtual.description,
                policyAtual.percentual
            );
            policyAtivada.id = policyAtual.id;
            // Não setamos deletedAt, então fica null/undefined = ativa

            const resultado = await this.facade.update(policyAtivada);

            res.status(200).json({
                success: true,
                message: "Política de cancelamento ativada com sucesso",
                policy: resultado
            });

        } catch (error) {
            const err = error as Error;
            res.status(400).json({
                success: false,
                error: err.message
            });
        }
    }

    public async calcularMultaCancelamento(req: Request, res: Response): Promise<void> {
        try {
            const { policyId } = req.params;
            const { valorReserva, horasAntecedencia } = req.body;

            // Buscar a política
            const policies = await this.facade.list({ id: policyId } as Policy, 'findById') as Policy[];
            
            if (policies.length === 0) {
                res.status(404).json({
                    success: false,
                    error: "Política de cancelamento não encontrada"
                });
                return;
            }

            const policy = policies[0];

            // Verificar se a política está ativa
            if (policy.deletedAt) {
                res.status(400).json({
                    success: false,
                    error: "Política de cancelamento está inativa"
                });
                return;
            }

            // Calcular multa baseada na política
            let percentualMulta = policy.percentual;

            // Aplicar regras de negócio (exemplo: sem multa se cancelar com mais de 48h)
            if (horasAntecedencia > 48) {
                percentualMulta = 0; // Sem multa
            }

            const valorMulta = valorReserva * (percentualMulta / 100);
            const valorReembolsado = valorReserva - valorMulta;

            res.status(200).json({
                success: true,
                message: "Cálculo de multa realizado com sucesso",
                policy: policy,
                calculo: {
                    valorReserva,
                    horasAntecedencia,
                    percentualMulta,
                    valorMulta,
                    valorReembolsado
                }
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
            const policies = await this.facade.list({} as Policy, 'findAll') as Policy[];

            const stats = {
                total: policies.length,
                ativas: policies.filter(p => !p.deletedAt).length,
                inativas: policies.filter(p => p.deletedAt).length,
                percentualMedio: this.calcularPercentualMedio(policies),
                porFaixaPercentual: this.agruparPorFaixaPercentual(policies)
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

    // Métodos auxiliares para estatísticas
    private calcularPercentualMedio(policies: Policy[]): number {
        if (policies.length === 0) return 0;
        const total = policies.reduce((sum, policy) => sum + policy.percentual, 0);
        return Number((total / policies.length).toFixed(2));
    }

    private agruparPorFaixaPercentual(policies: Policy[]): { [faixa: string]: number } {
        return policies.reduce((acc, policy) => {
            let faixa = '';
            if (policy.percentual === 0) faixa = '0%';
            else if (policy.percentual <= 25) faixa = '1-25%';
            else if (policy.percentual <= 50) faixa = '26-50%';
            else if (policy.percentual <= 75) faixa = '51-75%';
            else faixa = '76-100%';

            acc[faixa] = (acc[faixa] || 0) + 1;
            return acc;
        }, {} as { [faixa: string]: number });
    }
}