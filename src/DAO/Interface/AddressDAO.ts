import { Connection, Repository } from "typeorm";
import IDAO from "../IDAO";
import { Address } from "../../entities/address";

export default class AddressDAO implements IDAO<Address> {
    private dataSource: Connection;
    private repository: Repository<Address>;

    constructor(dataSource: Connection) {      
        this.dataSource = dataSource;
        this.repository = this.dataSource.getRepository(Address);
    }

    async create (address: Address): Promise<Address> {
        return await this.repository.save(address);
    }

    async delete(address: Address): Promise<void> {
        await this.repository.remove(address);
    }

    async update(Entity: Address): Promise<Address> {
        return await this.repository.save(Entity);
    }

    async list(address: Address, operation: string): Promise<Address[]> {
        switch (operation) {
            case "findAll":
                return await this.repository.find({
                    where: {isActive: true},
                });
            case "findById":
                return await this.repository.find({
                    where: {id: address.id},
                });
            default:
                throw new Error("Não foi possível realizar a operação");
        }
    }
}