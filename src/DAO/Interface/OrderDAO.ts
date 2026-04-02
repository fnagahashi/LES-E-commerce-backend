import { DataSource, Repository } from "typeorm";
import Order from "../../entities/order";
import IDAO from "../IDAO";

export default class OrderDAO implements IDAO<Order> {
  private repository: Repository<Order>;

  constructor(connection: DataSource) {
    this.repository = connection.getRepository(Order);
  }

  async create(order: Order): Promise<Order> {
    return this.repository.save(order);
  }

  async update(order: Order): Promise<Order> {
    return this.repository.save(order);
  }

  async delete(order: Order): Promise<void> {
    await this.repository.remove(order);
  }

  async findById(id: string): Promise<Order> {
    return this.repository.findOne({
      where: { id },
      relations: ['orderItems', 'payment', 'delivery', 'client'],
    });
  }

  async findAll(): Promise<Order[]> {
    return this.repository.find({
      relations: ['orderItems', 'payment', 'delivery', 'client'],
    });
  }

  async findByFilters(filters: Partial<Order>): Promise<Order[]> {
    return this.repository.find({ where: filters });
  }

  async findBySearch(search: string): Promise<Order[]> {
    return this.repository
      .createQueryBuilder('venda')
      .leftJoinAndSelect('venda.cliente', 'cliente')
      .where('cliente.nome ILIKE :search', { search: `%${search}%` })
      .getMany();
  }
}
