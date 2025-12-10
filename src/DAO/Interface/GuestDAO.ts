import { DataSource, Like, Repository } from "typeorm";
import Guest from "../../entities/guest";
import IDAO from "../IDAO";

export default class GuestDAO implements IDAO<Guest> {
  private repository: Repository<Guest>;

  constructor(connection: DataSource) {
    this.repository = connection.getRepository(Guest);
  }

  async create(guest: Guest): Promise<Guest> {
    return await this.repository.save(guest);
  }

  async list(guest: Guest, operation: string): Promise<Guest[]> {
    switch (operation) {
      case "findAll":
        return await this.repository.find();
      case "findById":
        return await this.repository.find({
          where: { id: guest.id },
        });
      case "findByFilters":
        const cpf = guest.cpf ? Like(`%${guest.cpf}%`) : Like(`%`);
        const email = guest.email ? Like(`%${guest.email}%`) : Like(`%`);
        const name = guest.name ? Like(`%${guest.name}%`) : Like(`%`);
        const phone = guest.phone ? Like(`%${guest.phone}%`) : Like(`%`);
        return await this.repository.find({
          where: {
            cpf,
            email,
            name,
            phone,
          },
        });
      case "findByEmail":
        return await this.repository.find({
          where: { email: guest.email },
        });
      default:
        throw new Error("Operation not supported");
    }
  }

  async update(guest: Guest): Promise<Guest> {
    const clientExists = await this.list(guest, "findById");
    if (!clientExists) {
      throw new Error("Hospede não encontrado");
    }
    const updatedGuest = this.repository.merge(clientExists[0], guest);
    return await this.repository.save(updatedGuest);
  }

  async delete(guest: Guest): Promise<void> {
    await this.repository.softDelete(guest.id);
  }
}
