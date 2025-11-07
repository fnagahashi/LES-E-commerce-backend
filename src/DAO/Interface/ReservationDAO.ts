import { DataSource, Like, ILike, Repository } from "typeorm";
import IDAO from "../IDAO";
import Reservation from "../../entities/reservation";

export default class ReservationDAO implements IDAO<Reservation> {
  private dataSource: DataSource;
  private repository: Repository<Reservation>;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.repository = this.dataSource.getRepository(Reservation);
  }

  async create(reservation: Reservation): Promise<Reservation> {
    return await this.repository.save(reservation);
  }

  async list(reservation: Reservation, operation: string): Promise<Reservation[]> {
    switch (operation) {
      case "findAll":
        return await this.repository.findAll();
      case "findById":
        return await this.repository.find({
          where: {id: reservation.id}, 
        });
      case "findByFilters":
        const type = payment.type ? ILike(`%${payment.type}%`) : ILike(`%`);
        const status = payment.status ? ILike(`%${payment.status}%`) : ILike(`%`);
        return await this.repository.find({
          where: {
            type: payment.type,
            status: payment.status,
          }
        });
    case "findByReservation":
        if (!payment.reservation) {
          throw new Error("reservationId é obrigatório para esta operação");
        }
      default:
        throw new Error("Operation not supported");
    }
  }

  async update(payment: Payment): Promise<Payment> {
    const paymentExists = await this.list(payment, "findById");
    if (!paymentExists) {
      throw new Error("Pagamento não encontrado");
    }
    const updatedPayment = this.repository.merge(paymentExists[0], payment);
    return await this.repository.save(updatedPayment);
  }

  async delete(payment: Payment): Promise<void> {
    await this.repository.softDelete(payment.id);
  }
}