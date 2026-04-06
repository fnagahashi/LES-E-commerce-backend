import { DataSource, Repository } from "typeorm";
import Cupom from "../../entities/cupom";

export default class CupomDAO {
  private repository: Repository<Cupom>;

  constructor(connection: DataSource) {
    this.repository = connection.getRepository(Cupom);
  }

  async create(cupom: Cupom): Promise<Cupom> {
    return this.repository.save(cupom);
  }

  async findById(id: string): Promise<Cupom | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findByCode(cupomCode: string): Promise<Cupom | null> {
    return this.repository.findOne({
      where: { cupomCode },
      relations: ["client"],
    });
  }

  async findAll(): Promise<Cupom[]> {
    return this.repository.find();
  }

  async findByClient(clientId: string) {
    return await this.repository.find({
      where: {
        client: { id: clientId },
        isActive: true,
        used: false,
      },
    });
  }

  async markAsUsed(cupomId: string) {
    await this.repository.update(cupomId, {
      used: true,
    });
  }
}
