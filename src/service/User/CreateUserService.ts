import { IUserRequest } from "../../DAO/Interface/IUserinterface";
import { UsersRepositories } from "../../repository/UsersRepositories";
import { getCustomRepository } from "typeorm";
import { hash } from "bcryptjs";

class CreateUserService {
  async execute({ name, email, admin = false, password }: IUserRequest) {

    if (!email) { 
        throw new Error("Email incorreto"); 
    }
    const usersRepository = getCustomRepository(UsersRepositories);
    const userAlreadyExists = await usersRepository.findOne({ email, });

    if (!password) { 
        throw new Error("Password incorreto"); 
    }
    const passwordHash = await hash(password, 8);
    const user = usersRepository.create({ name, email, admin, password: passwordHash, });
    await usersRepository.save(user);
    return user;
  }
}
export { CreateUserService };