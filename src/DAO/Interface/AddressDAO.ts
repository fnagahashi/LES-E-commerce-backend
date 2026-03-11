import { DataSource, Repository } from "typeorm";
import IDAO from "../IDAO";
import Address from "../../entities/address";

export default class AddressDAO implements IDAO<Address> {
  private repository: Repository<Address>;

  constructor(connection: DataSource) {
    this.repository = connection.getRepository(Address);
  }

  async create(address: Address): Promise<Address> {
    return await this.repository.save(address);
  }

  async delete(address: Address): Promise<void> {
    await this.repository.remove(address);
  }

  async update(Entity: Address): Promise<Address> {
    return await this.repository.save(Entity);
  }

  async findAll(): Promise<Address[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<Address | null> {
    return this.repository.findOne({
      where:{id},
    });
  }

  async findByFilters(filters: Partial<Address>): Promise<Address[]> {
    return this.repository.find();
  }
}
