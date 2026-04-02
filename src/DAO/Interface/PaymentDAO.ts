import { DataSource, Repository } from "typeorm";
import Payment from "../../entities/payment";
import IDAO from "../IDAO";

export default class PaymentDAO implements IDAO<Payment> {
  private repository: Repository<Payment>;

  constructor(connection: DataSource) {
    this.repository = connection.getRepository(Payment);
  }

  async create(Payment: Payment): Promise<Payment> {
    return await this.repository.save(Payment);
  }

  async findById(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  async update(Payment: Payment): Promise<Payment> {
    const paymentExists = await this.findById(Payment.id);
    if (!paymentExists) {
      throw new Error("Pagamento não encontrado");
    }
    const updatedPayment = this.repository.merge(paymentExists, Payment);
    return await this.repository.save(updatedPayment);
  }

  async delete(entity: Payment) {
    await this.repository.delete(entity);
  }

  async findAll(): Promise<Payment[]> {
    return this.repository.find();
  }

  async findByFilters(filters: Partial<Payment>) {
    return this.repository.find({ where: filters });
  }

  async findBySearch(search: string) {
    return [];
  }
}
