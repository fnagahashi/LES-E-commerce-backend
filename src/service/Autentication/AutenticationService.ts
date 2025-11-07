import{sign} from "jsonwebtoken";
import {compare, hash} from "bcryptjs";
import { IClientRequest } from "../../DAO/Interface/GuestDAO";
import { getCustomRepository } from "typeorm";
import { ClientRepositories } from "../../repository/GuestRepositories";
import { ILoginRequest } from "../../DAO/Interface/ILoginRequest";

class AutenticationService {
    async execute ({email, password}: ILoginRequest){
        if (!email) {
            throw new Error("Email incorreto");
        }
        if (!password){
            throw new Error("Password incorreto");
        }
    const clientRepository = getCustomRepository(ClientRepositories);
    const clientAlreadyExists = await clientRepository.findOne({ where: { email: email },});
    if (!clientAlreadyExists) {
        throw new Error("Cliente nao encontrado");
    }
    const passwordMatch = await compare(password, clientAlreadyExists.password);

      if (!passwordMatch) {
         throw new Error("Senha incorreta");
    }
    //Gerar token
    const token = sign(
        {
            email: email,
        },
        "ecommerce",
        {
            subject: ("others"),
            expiresIn: "1d",
        }
    );
    return token;
    }
}
export {AutenticationService};