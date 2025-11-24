import { Request, Response } from "express";
import Facade from "../../facade/Facade";
import Reservation from "../../entities/reservation";

export class NotificationController {
    constructor(private readonly facade: Facade) {}

    public async enviarConfirmacaoReserva(req: Request, res: Response): Promise<void> {
        try {
            const { reservationId } = req.params;
            
            const reservations = await this.facade.list({ id: reservationId } as Reservation, 'findById') as Reservation[];
            
            if (reservations.length === 0) {
                res.status(404).json({ error: "Reserva não encontrada" });
                return;
            }

            const reservation = reservations[0];
            
            const emailEnviado = await this.enviarEmail(
                reservation.guest.email,
                'Confirmação de Reserva',
                this.gerarTemplateConfirmacao(reservation)
            );

            res.status(200).json({
                success: true,
                message: "Confirmação de reserva enviada com sucesso",
                emailEnviado
            });

        } catch (error) {
            const err = error as Error;
            res.status(400).json({ error: err.message });
        }
    }

    public async enviarConfirmacaoCancelamento(req: Request, res: Response): Promise<void> {
        try {
            const { reservationId } = req.params;
            
            const reservations = await this.facade.list({ id: reservationId } as Reservation, 'findById') as Reservation[];
            
            if (reservations.length === 0) {
                res.status(404).json({ error: "Reserva não encontrada" });
                return;
            }

            const reservation = reservations[0];
            
            const emailEnviado = await this.enviarEmail(
                reservation.guest.email,
                'Cancelamento de Reserva',
                this.gerarTemplateCancelamento(reservation)
            );

            res.status(200).json({
                success: true,
                message: "Confirmação de cancelamento enviada com sucesso",
                emailEnviado
            });

        } catch (error) {
            const err = error as Error;
            res.status(400).json({ error: err.message });
        }
    }

    private async enviarEmail(destinatario: string, assunto: string, conteudo: string): Promise<boolean> {
        console.log(`📧 Enviando email para: ${destinatario}`);
        console.log(`Assunto: ${assunto}`);
        console.log(`Conteúdo: ${conteudo}`);
        
        return true;
    }

    private gerarTemplateConfirmacao(reservation: Reservation): string {
        return `
            Confirmação de Reserva - Hotel
            Código: ${reservation.codeReservation}
            Hóspede: ${reservation.guest.name}
            Check-in: ${reservation.dateStart.toLocaleDateString()}
            Check-out: ${reservation.dateEnd.toLocaleDateString()}
            Valor Total: R$ ${reservation.priceTotal}
        `;
    }

    private gerarTemplateCancelamento(reservation: Reservation): string {
        return `
            Cancelamento de Reserva - Hotel
            Código: ${reservation.codeReservation}
            Status: Cancelada
        `;
    }
}