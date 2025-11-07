import { getCustomRepository } from "typeorm";
import { IAddressRequest } from "../../DAO/Interface/AddressDAO";
import { AddressRepositories } from "../../repository/AddressRepositories";

class UpdateAddressService {
    async execute ({id, nameAddress, cep, streetType, street, neighborhood, city, state, country, number, typeResidence, obs, typeAddress }: IAddressRequest){
        const addressRepository = getCustomRepository(AddressRepositories);
        
        const address = await addressRepository.findOne(id);
        
        if (!address) {
            throw new Error ("Endereço não encontrado");
        }

        if (nameAddress) {
            address.nameAddress = nameAddress;
        }
        if (cep) {
            address.cep = cep;
        }
        if (streetType) {
            address.streetType = streetType;
        }
        if (street) {
            address.street = street;
        }
        if (neighborhood) {
            address.neighborhood = neighborhood;
        }
        if (city) {
            address.city = city;
        }
        if (state) {
            address.state = state;
        }
        if (country) {
            address.country = country;
        }
        if (number) {
            address.number = number;
        }
        if (typeResidence) {
            address.typeResidence = typeResidence;
        }
        if (obs) {
            address.obs = obs;
        }
        if (typeAddress) {
            address.typeAddress = typeAddress;
        }

        await addressRepository.save(address);

        return address;
    }
}
export {UpdateAddressService};