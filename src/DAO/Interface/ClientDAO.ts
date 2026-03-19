import { DataSource, Like, Repository } from "typeorm";
import Client from "../../entities/client";
import IDAO from "../IDAO";

export default class ClientDAO implements IDAO<Client> {
  private repository: Repository<Client>;

  constructor(connection: DataSource) {
    this.repository = connection.getRepository(Client);
  }

  async create(Client: Client): Promise<Client> {
    return await this.repository.save(Client);
  }

  async findAll(): Promise<Client[]> {
    return await this.repository.find();
  }

  async findById(id: string): Promise<Client | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async update(Client: Client): Promise<Client> {
    const clientExists = await this.findById(Client.id);
    if (!clientExists) {
      throw new Error("Cliente não encontrado");
    }
    const updatedClient = this.repository.merge(clientExists, Client);
    return await this.repository.save(updatedClient);
  }

  async delete(Client: Client): Promise<void> {
    await this.repository.softDelete(Client.id);
  }

  async findByFilters(filters: Partial<Client>): Promise<Client[]> {
    const query = this.repository
      .createQueryBuilder("client")
      .leftJoinAndSelect("client.addresses", "address")
      .leftJoinAndSelect("client.creditCard", "creditCard");

    if (filters.cpf) {
      query.andWhere("client.cpf LIKE :cpf", { cpf: `%${filters.cpf}%` });
    }
    if (filters.email) {
      query.andWhere("client.email LIKE :email", {
        email: `%${filters.email}%`,
      });
    }

    if (filters.name) {
      query.andWhere("client.name LIKE :name", { name: `%${filters.name}%` });
    }

    if (filters.phoneNumber) {
      query.andWhere("client.phoneNumber LIKE :phoneNumber", {
        phoneNumber: `%${filters.phoneNumber}%`,
      });
    }

    if (filters.phoneDDD) {
      query.andWhere("client.phoneDDD = :phoneDDD", {
        phoneDDD: filters.phoneDDD,
      });
    }

    if (filters.isActive !== undefined) {
      query.andWhere("client.isActive = :isActive", {
        isActive: filters.isActive,
      });
    }
    return query.getMany();
  }
}
