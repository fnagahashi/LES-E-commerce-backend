import { getCustomRepository } from "typeorm";
import { IGuestRequest } from "../../DAO/Interface/GuestDAO";
import { GuestRepositories } from "../../repository/GuestRepositories";

class CreateGuestService {
    async execute ({name, dateBirth, email, cpf, phone, isActive, addresses }: IGuestRequest){
        if (!email) {
            throw new Error ("Email invalido");
        }
        const guestRepository = getCustomRepository(GuestRepositories);
        const guestAlreadyExist = await guestRepository.findOne({ cpf });
            if (guestAlreadyExist) {
                throw new Error("Já existe um cliente com este CPF");
            }

        const requiredFields = { name, dateBirth, email, cpf, phone, isActive, addresses };

        for (const [key, value] of Object.entries(requiredFields)) {
            if (value === undefined || value === null) {
        throw new Error(`${key} é obrigatório`);
    }
    if (typeof value === "string" && value.trim() === "") {
        throw new Error(`${key} é obrigatório`);
    }
    if (Array.isArray(value) && value.length === 0) {
        throw new Error(`${key} é obrigatório`);
    }
        }
        const guest = guestRepository.create({ name, dateBirth, email, cpf, phone, isActive, addresses });
        await guestRepository.save(guest);

        return guest;
    }
}
export {CreateGuestService};