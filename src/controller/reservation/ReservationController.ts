// src/controllers/ReservationController.ts
import { Request, Response } from "express";
import Facade from "../../facade/Facade";
import Reservation from "../../entities/reservation";
import Guest from "../../entities/guest";
import Room from "../../entities/room";
import Payment from "../../entities/payment";

export class ReservationController {
  constructor(private readonly facade: Facade) {}

  public async criarProposta(req: Request, res: Response): Promise<void> {
    try {
      // RF0202: Criar reserva (proposta)
      const reservation = await this.definirReservationCriar(req);

      const reservationSalva = await this.facade.create(reservation);

      res.status(201).json({
        success: true,
        message: "Proposta de reserva criada com sucesso",
        reservation: reservationSalva,
      });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }

  private async definirReservationCriar(req: Request): Promise<Reservation> {
    const {
      codeReservation,
      guestId,
      roomId,
      dateStart,
      dateEnd,
      noShow,
      qntAdults,
      qntChildren,
      childrenAges,
      saleId,
      policyId,
    } = req.body;

    // Buscar guest e room para instanciar a Reservation
    const guests = (await this.facade.list(
      { id: guestId } as Guest,
      "findById"
    )) as Guest[];
    const rooms = (await this.facade.list(
      { id: roomId } as Room,
      "findById"
    )) as Room[];

    if (guests.length === 0) {
      throw new Error("Hóspede não encontrado");
    }

    if (rooms.length === 0) {
      throw new Error("Quarto não encontrado");
    }

    const guest = guests[0];
    const room = rooms[0];

    return new Reservation(
      codeReservation,
      guest,
      room,
      new Date(dateStart),
      new Date(dateEnd),
      noShow,
      qntAdults,
      qntChildren,
      childrenAges || []
    );
  }

  public async consultarDisponibilidade(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      // RF0201: Consultar disponibilidade
      const { dateStart, dateEnd, roomType, qntAdults, qntChildren } =
        req.query;

      const roomSearch = new Room("", roomType as any, 0, 0, 0, true);

      const searchCriteria = {
        dateStart: new Date(dateStart as string),
        dateEnd: new Date(dateEnd as string),
        qntAdults: qntAdults ? parseInt(qntAdults as string) : undefined,
        qntChildren: qntChildren ? parseInt(qntChildren as string) : undefined,
      };

      const roomsDisponiveis = (await this.facade.list(
        { ...roomSearch, ...searchCriteria } as any,
        "findAvailableRooms"
      )) as Room[];

      res.status(200).json({
        success: true,
        count: roomsDisponiveis.length,
        availableRooms: roomsDisponiveis,
      });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }

  public async confirmarReserva(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const reservas = (await this.facade.list(
        { id } as Reservation,
        "findById"
      )) as Reservation[];

      if (reservas.length === 0) {
        res.status(404).json({
          success: false,
          error: "Reserva não encontrada",
        });
        return;
      }

      const reserva = reservas[0];

      const pagamentos = (await this.facade.list(
        { reservation: reserva } as Payment,
        "findByReservation"
      )) as Payment[];

      if (pagamentos.length === 0) {
        res.status(400).json({
          success: false,
          error: "Nenhum pagamento encontrado para esta reserva",
        });
        return;
      }

      const pagamento = pagamentos[0];

      if (pagamento.status !== "approved") {
        res.status(400).json({
          success: false,
          error:
            "Pagamento ainda não aprovado — reserva não pode ser confirmada",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Reserva confirmada com sucesso",
        reservation: reserva,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  }

  public async cancelarReserva(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const reservations = (await this.facade.list(
        { id } as Reservation,
        "findById"
      )) as Reservation[];

      if (reservations.length === 0) {
        res.status(404).json({
          success: false,
          error: "Reserva não encontrada",
        });
        return;
      }

      const reservation = reservations[0];

      const reservationAtualizada = new Reservation(
        reservation.codeReservation,
        reservation.guest,
        reservation.room,
        reservation.dateStart,
        reservation.dateEnd,
        reservation.noShow,
        reservation.qntAdults,
        reservation.qntChildren,
        reservation.childrenAges
      );
      reservationAtualizada.id = reservation.id;

      const resultado = await this.facade.update(reservationAtualizada);

      res.status(200).json({
        success: true,
        message: "Reserva cancelada com sucesso",
        reservation: resultado,
      });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }

  public async marcarNoShow(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const reservations = (await this.facade.list(
        { id } as Reservation,
        "findById"
      )) as Reservation[];

      if (reservations.length === 0) {
        res.status(404).json({
          success: false,
          error: "Reserva não encontrada",
        });
        return;
      }

      const reservation = reservations[0];

      const reservationAtualizada = new Reservation(
        reservation.codeReservation,
        reservation.guest,
        reservation.room,
        reservation.dateStart,
        reservation.dateEnd,
        true,
        reservation.qntAdults,
        reservation.qntChildren,
        reservation.childrenAges
      );
      reservationAtualizada.id = reservation.id;

      const resultado = await this.facade.update(reservationAtualizada);

      res.status(200).json({
        success: true,
        message: "Reserva marcada como no-show",
        reservation: resultado,
      });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }

  public async atualizar(req: Request, res: Response): Promise<void> {
    try {
      // RF0204: Alterar reserva
      const { id } = req.params;

      // Buscar a reserva atual
      const reservations = (await this.facade.list(
        { id } as Reservation,
        "findById"
      )) as Reservation[];

      if (reservations.length === 0) {
        res.status(404).json({
          success: false,
          error: "Reserva não encontrada",
        });
        return;
      }

      const reservationAtual = reservations[0];
      const dadosAtualizacao = await this.definirReservationAtualizar(req);

      // Mesclar os dados mantendo o ID
      const reservationAtualizada = new Reservation(
        dadosAtualizacao.codeReservation || reservationAtual.codeReservation,
        dadosAtualizacao.guest || reservationAtual.guest,
        dadosAtualizacao.room || reservationAtual.room,
        dadosAtualizacao.dateStart || reservationAtual.dateStart,
        dadosAtualizacao.dateEnd || reservationAtual.dateEnd,
        dadosAtualizacao.noShow ?? reservationAtual.noShow,
        dadosAtualizacao.qntAdults ?? reservationAtual.qntAdults,
        dadosAtualizacao.qntChildren ?? reservationAtual.qntChildren,
        dadosAtualizacao.childrenAges || reservationAtual.childrenAges
      );
      reservationAtualizada.id = reservationAtual.id;

      const resultado = await this.facade.update(reservationAtualizada);

      res.status(200).json({
        success: true,
        message: "Reserva atualizada com sucesso",
        reservation: resultado,
      });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }

  private async definirReservationAtualizar(
    req: Request
  ): Promise<Partial<Reservation>> {
    const {
      codeReservation,
      guestId,
      roomId,
      dateStart,
      dateEnd,
      noShow,
      qntAdults,
      qntChildren,
      childrenAges,
      priceTotal,
      paymentStatus,
    } = req.body;

    const updateData: Partial<Reservation> = {};

    if (codeReservation) updateData.codeReservation = codeReservation;

    if (guestId) {
      const guests = (await this.facade.list(
        { id: guestId } as Guest,
        "findById"
      )) as Guest[];
      if (guests.length === 0) throw new Error("Hóspede não encontrado");
      updateData.guest = guests[0];
    }

    if (roomId) {
      const rooms = (await this.facade.list(
        { id: roomId } as Room,
        "findById"
      )) as Room[];
      if (rooms.length === 0) throw new Error("Quarto não encontrado");
      updateData.room = rooms[0];
    }

    if (dateStart) updateData.dateStart = new Date(dateStart);
    if (dateEnd) updateData.dateEnd = new Date(dateEnd);
    if (noShow !== undefined) updateData.noShow = noShow;
    if (qntAdults !== undefined) updateData.qntAdults = qntAdults;
    if (qntChildren !== undefined) updateData.qntChildren = qntChildren;
    if (childrenAges) updateData.childrenAges = childrenAges;

    return updateData;
  }

  public async atualizarStatusPagamento(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { paymentStatus } = req.body;

      const reservations = (await this.facade.list(
        { id } as Reservation,
        "findById"
      )) as Reservation[];

      if (reservations.length === 0) {
        res.status(404).json({
          success: false,
          error: "Reserva não encontrada",
        });
        return;
      }

      const reservation = reservations[0];

      const reservationAtualizada = new Reservation(
        reservation.codeReservation,
        reservation.guest,
        reservation.room,
        reservation.dateStart,
        reservation.dateEnd,
        reservation.noShow,
        reservation.qntAdults,
        reservation.qntChildren,
        reservation.childrenAges
      );
      reservationAtualizada.id = reservation.id;

      const resultado = await this.facade.update(reservationAtualizada);

      res.status(200).json({
        success: true,
        message: `Status de pagamento atualizado para: ${paymentStatus}`,
        reservation: resultado,
      });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }

  public async buscarPorFiltro(req: Request, res: Response): Promise<void> {
    try {
      // RF0206: Consultar reservas por filtros
      const filters = await this.definirFiltrosReserva(req);
      const reservations = (await this.facade.list(
        filters as Reservation,
        "findByFilters"
      )) as Reservation[];

      res.status(200).json({
        success: true,
        count: reservations.length,
        reservations,
      });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }

  private async definirFiltrosReserva(
    req: Request
  ): Promise<Partial<Reservation>> {
    const {
      codeReservation,
      guestId,
      roomId,
      dateStart,
      dateEnd,
      paymentStatus,
      periodStart,
      periodEnd,
    } = req.query;

    // Criar uma Reservation parcial para os filtros
    const filters: Partial<Reservation> = {};

    if (codeReservation) filters.codeReservation = codeReservation as string;
    if (guestId) {
      const guests = (await this.facade.list(
        { id: guestId } as Guest,
        "findById"
      )) as Guest[];
      if (guests.length > 0) filters.guest = guests[0];
    }
    if (roomId) {
      const rooms = (await this.facade.list(
        { id: roomId } as Room,
        "findById"
      )) as Room[];
      if (rooms.length > 0) filters.room = rooms[0];
    }
    if (dateStart) filters.dateStart = new Date(dateStart as string);
    if (dateEnd) filters.dateEnd = new Date(dateEnd as string);

    return filters;
  }

  public async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const reservations = (await this.facade.list(
        { id } as Reservation,
        "findById"
      )) as Reservation[];

      if (reservations.length === 0) {
        res.status(404).json({
          success: false,
          error: "Reserva não encontrada",
        });
        return;
      }

      res.status(200).json({
        success: true,
        reservation: reservations[0],
      });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }

  public async buscarPorCodigo(req: Request, res: Response): Promise<void> {
    try {
      const { codeReservation } = req.params;

      const reservations = (await this.facade.list(
        { codeReservation } as Reservation,
        "findByFilters"
      )) as Reservation[];

      if (reservations.length === 0) {
        res.status(404).json({
          success: false,
          error: "Reserva não encontrada",
        });
        return;
      }

      res.status(200).json({
        success: true,
        reservation: reservations[0],
      });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }

  public async buscarPorGuest(req: Request, res: Response): Promise<void> {
    try {
      const { guestId } = req.params;

      const guests = (await this.facade.list(
        { id: guestId } as Guest,
        "findById"
      )) as Guest[];
      if (guests.length === 0) {
        res.status(404).json({
          success: false,
          error: "Hóspede não encontrado",
        });
        return;
      }

      const reservations = (await this.facade.list(
        { guest: guests[0] } as Reservation,
        "findByFilters"
      )) as Reservation[];

      res.status(200).json({
        success: true,
        count: reservations.length,
        reservations,
      });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }

  public async getEstatisticas(req: Request, res: Response): Promise<void> {
    try {
      const { periodStart, periodEnd } = req.query;

      // Buscar todas as reservas para estatísticas
      const reservations = (await this.facade.list(
        {} as Reservation,
        "findAll"
      )) as Reservation[];

      const stats = {
        total: reservations.length,
        noShows: reservations.filter((r) => r.noShow).length,
      };

      res.status(200).json({
        success: true,
        stats,
      });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }
}
