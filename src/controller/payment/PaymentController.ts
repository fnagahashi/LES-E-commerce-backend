// // src/controllers/PaymentController.ts
// import { Request, Response } from "express";
// import Facade from "../../facade/Facade";
// import Payment, { PaymentStatus } from "../../entities/payment";
// import { PaymentMethod } from "../../enum/PaymentMethod";
// import CalcularValorTotal from "../../strategy/payment/CalcularValorTotal";
// import { RoomType } from "../../enum/RoomType";

// export class PaymentController {
//   constructor(private readonly facade: Facade) {}

//   public async marcarComoPago(req: Request, res: Response): Promise<void> {
//     try {
//       const { id } = req.params;

//       const payments = (await this.facade.list(
//         { id } as Payment,
//         "findById"
//       )) as Payment[];

//       if (payments.length === 0) {
//         res.status(404).json({
//           success: false,
//           error: "Pagamento não encontrado",
//         });
//         return;
//       }

//       const paymentAtual = payments[0];

//       if (
//         paymentAtual.status === "approved" ||
//         paymentAtual.status === "confirmed"
//       ) {
//         res.status(400).json({
//           success: false,
//           error: "Pagamento já está aprovado",
//         });
//         return;
//       }

//       if (paymentAtual.status === "cancelled") {
//         res.status(400).json({
//           success: false,
//           error: "Pagamento cancelado não pode ser aprovado",
//         });
//         return;
//       }

//       const paymentAtualizado = new Payment(
//         paymentAtual.reservation,
//         paymentAtual.type,
//         paymentAtual.price,
//         new Date(),
//         "approved"
//       );
//       paymentAtualizado.id = paymentAtual.id;

//       const resultado = await this.facade.update(paymentAtualizado);

//       res.status(200).json({
//         success: true,
//         message: "Pagamento marcado como aprovado com sucesso",
//         payment: resultado,
//       });
//     } catch (error) {
//       const err = error as Error;
//       res.status(400).json({
//         success: false,
//         error: err.message,
//       });
//     }
//   }

//   public async iniciarPagamento(req: Request, res: Response): Promise<void> {
//     console.log("Iniciando pagamento - corpo da requisição:", req.body);
//     try {
//       console.log("Definindo Payment para criação");
//       // RF0211: Iniciar pagamento
//       const payment = await this.definirPaymentCriar(req);
//       console.log("Payment definido:", payment);

//       const paymentSalvo = await this.facade.create(payment);
//       console.log("Payment salvo:", paymentSalvo);

//       res.status(201).json({
//         success: true,
//         message: "Pagamento iniciado com sucesso",
//         payment: paymentSalvo,
//       });
//     } catch (error) {
//       const err = error as Error;
//       res.status(400).json({
//         success: false,
//         error: err.message,
//       });
//     }
//   }

//   private async definirPaymentCriar(req: Request): Promise<Payment> {
//     console.log("Definindo Payment - corpo da requisição:", req.body);
//     const {
//       reservationId,
//       type = PaymentMethod.creditCard,
//       price,
//       paymentDate,
//       status = "pending",
//     } = req.body;

//     // Buscar a reserva
//     console.log("Definindo Payment - reservationId:", reservationId);
//     const reservationParam = new Reservation(
//       "",
//       "",
//       new Date(),
//       new Date(),
//       false,
//       0,
//       0,
//       []
//     );
//     reservationParam.id = reservationId;

//     const reservations = (await this.facade.list(
//       reservationParam,
//       "findById"
//     )) as Reservation[];

//     if (reservations.length === 0 || reservationId === undefined) {
//       throw new Error("Reserva não encontrada");
//     }
//     console.log("Reserva encontrada:", reservations[0]);

//     const reservation = reservations[0];

//     const roomParam = new Room("", RoomType.single, 0, 0, 0, true);
//     (roomParam as any).id = reservation.roomId;
//     const rooms = (await this.facade.list(roomParam, "findById")) as Room[];
//     console.log("Room encontrado para a reserva:", rooms[0]);
//     const precoBase = rooms[0]?.precoBase;

//     const pagamento = new Payment(
//       reservation,
//       type as PaymentMethod,
//       0,
//       new Date(),
//       reservationId ? status : "pending"
//     );

//     const calcularValorTotal = new CalcularValorTotal(this.facade["roomDAO"]);
//     const resultadoCalculo = await calcularValorTotal.executar(pagamento);

//     return new Payment(
//       reservation,
//       type as PaymentMethod,
//       pagamento.price,
//       paymentDate ? new Date(paymentDate) : new Date(),
//       reservationId ? status : "pending"
//     );
//   }

//   private async definirPaymentAtualizar(req: Request): Promise<Payment> {
//     const { reservationId, type, price, paymentDate, status } = req.body;

//     let reservation: Reservation | undefined;

//     if (reservationId) {
//       const reservations = (await this.facade.list(
//         { id: reservationId } as Reservation,
//         "findById"
//       )) as Reservation[];
//       if (reservations.length === 0) throw new Error("Reserva não encontrada");
//       reservation = reservations[0];
//     }

//     return new Payment(
//       reservation!,
//       type as PaymentMethod,
//       price ? parseFloat(price) : undefined,
//       paymentDate ? new Date(paymentDate) : undefined,
//       status
//     );
//   }

//   public async registrarResultado(req: Request, res: Response): Promise<void> {
//     try {
//       // RF0212: Registrar resultado de pagamento
//       const { id } = req.params;
//       const { status, paymentDate } = req.body;

//       const payments = (await this.facade.list(
//         { id } as Payment,
//         "findById"
//       )) as Payment[];

//       if (payments.length === 0) {
//         res.status(404).json({
//           success: false,
//           error: "Pagamento não encontrado",
//         });
//         return;
//       }

//       const paymentAtual = payments[0];

//       const paymentAtualizado = new Payment(
//         paymentAtual.reservation,
//         paymentAtual.type,
//         paymentAtual.price,
//         paymentDate ? new Date(paymentDate) : new Date(),
//         status
//       );
//       paymentAtualizado.id = paymentAtual.id;

//       const resultado = await this.facade.update(paymentAtualizado);

//       res.status(200).json({
//         success: true,
//         message: `Resultado do pagamento registrado: ${status}`,
//         payment: resultado,
//       });
//     } catch (error) {
//       const err = error as Error;
//       res.status(400).json({
//         success: false,
//         error: err.message,
//       });
//     }
//   }

//   public async estornarPagamento(req: Request, res: Response): Promise<void> {
//     try {
//       // RF0213: Estornar pagamento
//       const { id } = req.params;

//       const payments = (await this.facade.list(
//         { id } as Payment,
//         "findById"
//       )) as Payment[];

//       if (payments.length === 0) {
//         res.status(404).json({
//           success: false,
//           error: "Pagamento não encontrado",
//         });
//         return;
//       }

//       const paymentAtual = payments[0];

//       // Validar se o pagamento pode ser estornado
//       if (
//         paymentAtual.status !== "approved" &&
//         paymentAtual.status !== "confirmed"
//       ) {
//         res.status(400).json({
//           success: false,
//           error:
//             "Somente pagamentos aprovados/confirmados podem ser estornados",
//         });
//         return;
//       }

//       const paymentAtualizado = new Payment(
//         paymentAtual.reservation,
//         paymentAtual.type,
//         paymentAtual.price,
//         new Date(),
//         "cancelled"
//       );
//       paymentAtualizado.id = paymentAtual.id;

//       const resultado = await this.facade.update(paymentAtualizado);

//       res.status(200).json({
//         success: true,
//         message: "Pagamento estornado com sucesso",
//         payment: resultado,
//       });
//     } catch (error) {
//       const err = error as Error;
//       res.status(400).json({
//         success: false,
//         error: err.message,
//       });
//     }
//   }

//   public async buscarPorFiltro(req: Request, res: Response): Promise<void> {
//     try {
//       // RF0214: Consultar pagamentos por filtros
//       const filters = await this.definirFiltrosPayment(req);
//       const payments = (await this.facade.list(
//         filters as Payment,
//         "findByFilters"
//       )) as Payment[];

//       res.status(200).json({
//         success: true,
//         count: payments.length,
//         payments,
//       });
//     } catch (error) {
//       const err = error as Error;
//       res.status(400).json({
//         success: false,
//         error: err.message,
//       });
//     }
//   }

//   private async definirFiltrosPayment(req: Request): Promise<Partial<Payment>> {
//     const {
//       reservationId,
//       type,
//       status,
//       startDate,
//       endDate,
//       minPrice,
//       maxPrice,
//     } = req.query;

//     const filters: Partial<Payment> = {};

//     if (reservationId) {
//       const reservations = (await this.facade.list(
//         { id: reservationId } as Reservation,
//         "findById"
//       )) as Reservation[];
//       if (reservations.length > 0) {
//         filters.reservation = reservations[0];
//       }
//     }

//     if (type) filters.type = type as PaymentMethod;
//     if (status) filters.status = status as PaymentStatus;

//     // Filtros adicionais para o DAO
//     if (startDate || endDate || minPrice || maxPrice) {
//       (filters as any).dateRange = {
//         start: startDate ? new Date(startDate as string) : undefined,
//         end: endDate ? new Date(endDate as string) : undefined,
//       };
//       (filters as any).priceRange = {
//         min: minPrice ? parseFloat(minPrice as string) : undefined,
//         max: maxPrice ? parseFloat(maxPrice as string) : undefined,
//       };
//     }

//     return filters;
//   }

//   public async buscarPorId(req: Request, res: Response): Promise<void> {
//     try {
//       const { id } = req.params;

//       const payments = (await this.facade.list(
//         { id } as Payment,
//         "findById"
//       )) as Payment[];

//       if (payments.length === 0) {
//         res.status(404).json({
//           success: false,
//           error: "Pagamento não encontrado",
//         });
//         return;
//       }

//       res.status(200).json({
//         success: true,
//         payment: payments[0],
//       });
//     } catch (error) {
//       const err = error as Error;
//       res.status(400).json({
//         success: false,
//         error: err.message,
//       });
//     }
//   }

//   public async buscarPorReserva(req: Request, res: Response): Promise<void> {
//     try {
//       const { reservationId } = req.params;

//       const reservations = (await this.facade.list(
//         { id: reservationId } as Reservation,
//         "findById"
//       )) as Reservation[];

//       if (reservations.length === 0) {
//         res.status(404).json({
//           success: false,
//           error: "Reserva não encontrada",
//         });
//         return;
//       }

//       const payments = (await this.facade.list(
//         { reservation: reservations[0] } as Payment,
//         "findByFilters"
//       )) as Payment[];

//       res.status(200).json({
//         success: true,
//         count: payments.length,
//         payments,
//       });
//     } catch (error) {
//       const err = error as Error;
//       res.status(400).json({
//         success: false,
//         error: err.message,
//       });
//     }
//   }

//   public async buscarPorStatus(req: Request, res: Response): Promise<void> {
//     try {
//       const { status } = req.params;

//       const payments = (await this.facade.list(
//         { status } as Payment,
//         "findByFilters"
//       )) as Payment[];

//       res.status(200).json({
//         success: true,
//         count: payments.length,
//         payments,
//       });
//     } catch (error) {
//       const err = error as Error;
//       res.status(400).json({
//         success: false,
//         error: err.message,
//       });
//     }
//   }

//   public async buscarPorTipo(req: Request, res: Response): Promise<void> {
//     try {
//       const { type } = req.params;

//       const payments = (await this.facade.list(
//         { type: type as PaymentMethod } as Payment,
//         "findByFilters"
//       )) as Payment[];

//       res.status(200).json({
//         success: true,
//         count: payments.length,
//         payments,
//       });
//     } catch (error) {
//       const err = error as Error;
//       res.status(400).json({
//         success: false,
//         error: err.message,
//       });
//     }
//   }

//   public async atualizar(req: Request, res: Response): Promise<void> {
//     try {
//       const { id } = req.params;

//       // Buscar o pagamento atual
//       const payments = (await this.facade.list(
//         { id } as Payment,
//         "findById"
//       )) as Payment[];

//       if (payments.length === 0) {
//         res.status(404).json({
//           success: false,
//           error: "Pagamento não encontrado",
//         });
//         return;
//       }

//       const paymentAtual = payments[0];
//       const dadosAtualizacao = await this.definirPaymentAtualizar(req);

//       const paymentAtualizado = new Payment(
//         dadosAtualizacao.reservation || paymentAtual.reservation,
//         dadosAtualizacao.type || paymentAtual.type,
//         dadosAtualizacao.price ?? paymentAtual.price,
//         dadosAtualizacao.paymentDate || paymentAtual.paymentDate,
//         dadosAtualizacao.status || paymentAtual.status
//       );
//       paymentAtualizado.id = paymentAtual.id;

//       const resultado = await this.facade.update(paymentAtualizado);

//       res.status(200).json({
//         success: true,
//         message: "Pagamento atualizado com sucesso",
//         payment: resultado,
//       });
//     } catch (error) {
//       const err = error as Error;
//       res.status(400).json({
//         success: false,
//         error: err.message,
//       });
//     }
//   }

//   public async getEstatisticas(req: Request, res: Response): Promise<void> {
//     try {
//       const { startDate, endDate } = req.query;

//       const filters: any = {};
//       if (startDate) filters.startDate = new Date(startDate as string);
//       if (endDate) filters.endDate = new Date(endDate as string);

//       const payments = (await this.facade.list(
//         filters as Payment,
//         "findByFilters"
//       )) as Payment[];

//       const stats = {
//         total: payments.length,
//         porStatus: this.agruparPorStatus(payments),
//         porTipo: this.agruparPorTipo(payments),
//         receitaTotal: this.calcularReceita(payments),
//         taxaAprovacao: this.calcularTaxaAprovacao(payments),
//         estornos: payments.filter((p) => p.status === "cancelled").length,
//         valorMedio: this.calcularValorMedio(payments),
//       };

//       res.status(200).json({
//         success: true,
//         stats,
//       });
//     } catch (error) {
//       const err = error as Error;
//       res.status(400).json({
//         success: false,
//         error: err.message,
//       });
//     }
//   }

//   private agruparPorStatus(payments: Payment[]): { [status: string]: number } {
//     return payments.reduce(
//       (acc, payment) => {
//         const status = payment.status;
//         acc[status] = (acc[status] || 0) + 1;
//         return acc;
//       },
//       {} as { [status: string]: number }
//     );
//   }

//   private agruparPorTipo(payments: Payment[]): { [tipo: string]: number } {
//     return payments.reduce(
//       (acc, payment) => {
//         const tipo = payment.type;
//         acc[tipo] = (acc[tipo] || 0) + 1;
//         return acc;
//       },
//       {} as { [tipo: string]: number }
//     );
//   }

//   private calcularReceita(payments: Payment[]): number {
//     const pagamentosAprovados = payments.filter(
//       (p) => p.status === "approved" || p.status === "confirmed"
//     );
//     return pagamentosAprovados.reduce((sum, p) => sum + p.price, 0);
//   }

//   private calcularTaxaAprovacao(payments: Payment[]): number {
//     if (payments.length === 0) return 0;
//     const aprovados = payments.filter(
//       (p) => p.status === "approved" || p.status === "confirmed"
//     ).length;
//     return Number(((aprovados / payments.length) * 100).toFixed(2));
//   }

//   private calcularValorMedio(payments: Payment[]): number {
//     if (payments.length === 0) return 0;
//     const total = payments.reduce((sum, p) => sum + p.price, 0);
//     return Number((total / payments.length).toFixed(2));
//   }
// }
