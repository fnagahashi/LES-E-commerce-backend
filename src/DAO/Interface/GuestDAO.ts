import { DataSource, Like, ILike, Repository } from "typeorm";
import Guest from "../../entities/guest";
import IDAO from "../IDAO";

export default class GuestDAO implements IDAO<Guest> {
  private dataSource: DataSource;
  private repository: Repository<Guest>;

  constructor(dataSource: DataSource) {      
    this.dataSource = dataSource;
    this.repository = this.dataSource.getRepository(Guest);
  }

  async create(guest: Guest): Promise<Guest> {
    return await this.repository.save(guest);
  }

  async list(guest:Guest, operation: string): Promise<Guest[]> {
    switch (operation) {
      case "findAll":
        return await this.repository.find({
          where: {isActive: true}, 
        });
      case "findById":
        return await this.repository.find({
          where: {id: guest.id}, 
        });
      case "findByFilters":
        const cpf = guest.cpf ? ILike(`%${guest.cpf}%`) : ILike(`%`);
        const email = guest.email ? ILike(`%${guest.email}%`) : ILike(`%`);
        const name = guest.name ? ILike(`%${guest.name}%`) : ILike(`%`);
        const phone = guest.phone ? ILike(`%${guest.phone}%`) : ILike(`%`);
        return await this.repository.find({
          where: {
            cpf,
            email,
            name,
            phone
          }
        });
      case "findByEmail":
        return await this.repository.find({
          where: {email: guest.email},
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