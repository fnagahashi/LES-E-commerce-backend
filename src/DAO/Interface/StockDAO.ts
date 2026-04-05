import { DataSource, Repository } from "typeorm";
import Stock from "../../entities/stock";
import IDAO from "../IDAO";

export default class StockDAO implements IDAO<Stock> {
  private repository: Repository<Stock>;

  constructor(connection: DataSource) {
    this.repository = connection.getRepository(Stock);
  }
  async create(Stock: Stock): Promise<Stock> {
    return await this.repository.save(Stock);
  }

  async update(Stock: Stock): Promise<Stock> {
    const stockExists = await this.findById(Stock.id);
    if (!stockExists) {
      throw new Error("Estoque não encontrado");
    }
    const updatedStock = this.repository.merge(stockExists, Stock);
    return await this.repository.save(updatedStock);
  }

  async delete(entity: Stock) {
    await this.repository.delete(entity);
  }

  async findById(id: string) {
    return this.repository.findOne({
      where: { id },
      relations: ["book"],
    });
  }
  async findAll() {
    return this.repository.find({ relations: ['book'] });
  }

  async findByFilters(filters: Partial<Stock>) {
    return this.repository.find({ where: filters });
  }

  async findBySearch(search: string) {
    return [];
  }
}
