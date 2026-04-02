import { DataSource, Repository } from "typeorm";
import Cupom from "../../entities/cupom";

export default class CupomDAO {
  private repository: Repository<Cupom>;

  constructor(connection: DataSource) {
    this.repository = connection.getRepository(Cupom);
  }

  async findById(id: string): Promise<Cupom | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findByCode(cupomCode: string) {
    return this.repository.findOne({
      where: { cupomCode },
    });
  }

  async findAll(): Promise<Cupom[]> {
    return this.repository.find();
  }
}
