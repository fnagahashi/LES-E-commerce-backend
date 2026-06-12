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

  async findById(id: string): Promise<Order | null> {
    return this.repository.findOne({
      where: { id },
      relations: [
        "orderItems",
        "payment",
        "delivery",
        "client",
        "orderItems.book",
        "orderItems.book.stock.book",
      ],
    });
  }

  async findAll(): Promise<Order[]> {
    return this.repository.find({
      relations: ["orderItems", "payment", "delivery", "client"],
    });
  }

  async findByFilters(filters: Partial<Order>): Promise<Order[]> {
    return this.repository.find({ where: filters });
  }

  async findBySearch(search: string): Promise<Order[]> {
    return this.repository
      .createQueryBuilder("venda")
      .leftJoinAndSelect("venda.cliente", "cliente")
      .where("cliente.nome ILIKE :search", { search: `%${search}%` })
      .getMany();
  }

  async findByClient(clientId: string) {
    return this.repository.find({
      where: { client: { id: clientId } },
      relations: ["orderItems", "orderItems.book", "payment"],
    });
  }

  async getSalesByCategory(startDate: Date, endDate: Date): Promise<any[]> {
    return this.repository
      .createQueryBuilder("order")
      .innerJoin("order.orderItems", "item")
      .innerJoin("item.book", "book")
      .select("TO_CHAR(order.orderDate, 'YYYY-MM-DD')", "month")
      .addSelect("book.category", "category")
      .addSelect("SUM(item.quantity)", "totalSold")
      .where("order.orderDate BETWEEN :start AND :end", {
        start: startDate,
        end: endDate,
      })
      .andWhere("order.status != :status", { status: "cancelled" })
      .groupBy("TO_CHAR(order.orderDate, 'YYYY-MM-DD')")
      .addGroupBy("book.category")
      .orderBy("TO_CHAR(order.orderDate, 'YYYY-MM-DD')", "ASC")
      .getRawMany();
  }
}
