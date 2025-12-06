import { DataSource, Like, Repository, Between } from "typeorm";
import IDAO from "../IDAO";
import Reservation from "../../entities/reservation";

export default class ReservationDAO implements IDAO<Reservation> {
  private repository: Repository<Reservation>;

  constructor(connection: DataSource) {
    this.repository = connection.getRepository(Reservation);
  }

  async create(reservation: Reservation): Promise<Reservation> {
    return await this.repository.save(reservation);
  }

  async list(
    reservation: Reservation,
    operation: string
  ): Promise<Reservation[]> {
    switch (operation) {
      case "findAll":
        return await this.repository.find({
          relations: ["guest", "room"],
        });
      case "findById":
        return await this.repository.find({
          where: { id: reservation.id },
        });
      case "findByFilters":
        return await this.findByFilters(reservation);

      case "findByReservationCode":
        if (!reservation.codeReservation) {
          throw new Error("Código da reserva é obrigatório para esta operação");
        }
      default:
        throw new Error("Operation not supported");
    }
  }
  private async findByFilters(filters: Reservation): Promise<Reservation[]> {
    const whereClause: any = {};

    if (filters.codeReservation) {
      whereClause.codeReservation = Like(`%${filters.codeReservation}%`);
    }

    if (filters.guestId) {
      whereClause.guestId = filters.guestId;
    }

    if (filters.roomId) {
      whereClause.roomId = filters.roomId;
    }

    if (filters.dateStart) {
      whereClause.dateStart = filters.dateStart;
    }

    if (filters.dateEnd) {
      whereClause.dateEnd = filters.dateEnd;
    }

    if (filters.dateStart && filters.dateEnd) {
      whereClause.dateStart = Between(filters.dateStart, filters.dateEnd);
    }

    if (filters.noShow !== undefined && filters.noShow !== null) {
      whereClause.noShow = filters.noShow;
    }

    return await this.repository.find({
      where: whereClause,
      relations: ["guest", "room"],
      order: {
        dateStart: "ASC",
        created_at: "DESC",
      },
    });
  }

  async update(reservation: Reservation): Promise<Reservation> {
    const reservationExists = await this.list(reservation, "findById");
    if (!reservationExists) {
      throw new Error("Reserva não encontrada");
    }
    const updatedReservation = this.repository.merge(
      reservationExists[0],
      reservation
    );
    return await this.repository.save(updatedReservation);
  }

  async delete(reservation: Reservation): Promise<void> {
    await this.repository.softDelete(reservation.id);
  }
}
