import { IAddressRequest } from "../../DAO/Interface/AddressDAO";
import { AddressRepositories } from "../../repository/AddressRepositories";
import { Client } from "../../entities/guest";
import { getCustomRepository, getRepository } from "typeorm";

class CreateAddressService {
  async execute({ cep, street, neighborhood, number, city, state, obs, clientId }: IAddressRequest) {

    if (!street || street.trim() === "") {
      throw new Error("Rua Obrigatória");
    }

    const addressRepository = getCustomRepository(AddressRepositories);
    const clientRepository = getRepository(Client);

    const client = await clientRepository.findOne({ where: { id: clientId } });
    if (!client) {
      throw new Error("Cliente não encontrado");
    }

    const addressAlreadyExists = await addressRepository.findOne({ where: { client: { id: client.id } } });
    if (addressAlreadyExists) {
      throw new Error("Endereço já existe");
    }

    const address = addressRepository.create({
      cep,
      street,
      neighborhood,
      number,
      city,
      state,
      obs,
      client,
    });

    await addressRepository.save(address);

    const allAddresses = await addressRepository.find({ where: { client: { id: client.id } } });

    return address;
  }
}

export { CreateAddressService };
