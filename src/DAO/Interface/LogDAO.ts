import IDAO from "../IDAO";
import { DataSource, Repository } from "typeorm";
import Log from "../../entities/log";

export default class LogDAO implements IDAO<Log> {
  private repository: Repository<Log>;

  constructor(connection: DataSource) {
    this.repository = connection.getRepository(Log);
  }

  async create(log: Log): Promise<Log> {
    return await this.repository.save(log);
  }

  async findById(id: string): Promise<Log | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async update(log: Log): Promise<Log> {
    const logEncontrado = await this.findById(log.id);
    const logAtualizado = this.repository.merge(logEncontrado, log);
    await this.repository.update(log.id, logAtualizado);
    return await this.findById(log.id);
  }

  async findAll(): Promise<Log[]> {
    return this.repository.find();
  }

  async findByFilters(filters: Partial<Log>): Promise<Log[]> {
    return this.repository.find();
  }

  async delete(log: Log): Promise<void> {
    await this.repository.delete(log.id);
  }
  async findBySearch(search: string): Promise<Log[]> {
    return this.repository.find();
  }
}
