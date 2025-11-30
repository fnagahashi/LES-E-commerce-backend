import { Connection, Like, Repository } from "typeorm";
import IDAO from "../IDAO";
import Payment from "../../entities/payment";

export default class PaymentDAO implements IDAO<Payment> {
  private dataSource: Connection;
  private repository: Repository<Payment>;

  constructor(dataSource: Connection) {      
    this.dataSource = dataSource;
    this.repository = this.dataSource.getRepository(Payment);
  }

  async create(payment: Payment): Promise<Payment> {
    return await this.repository.save(payment);
  }

  async list(payment: Payment, operation: string): Promise<Payment[]> {
    switch (operation) {
      case "findAll":
        return await this.repository.find({
          where: {isActive: true}, 
        });
      case "findById":
        return await this.repository.find({
          where: {id: payment.id}, 
        });
      case "findByFilters":
        const type = payment.type ? Like(`%${payment.type}%`) : Like(`%`);
        const status = payment.status ? Like (`%${payment.status}%`) : Like(`%`);
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