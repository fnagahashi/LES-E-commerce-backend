import { getCustomRepository } from "typeorm";
import { IUserRequest } from "../../DAO/Interface/IUserinterface";
import { UsersRepositories } from "../../repository/UsersRepositories";
import { hash } from "bcryptjs";

export default class UpdateUserService {
   async execute({ id, name, admin = false, password }: IUserRequest) {
      const userRepository = getCustomRepository(UsersRepositories);
      const user = await userRepository.findOne(id);

      if (!user) {
         throw new Error("Usuário não encontrado");
      }

      if (name) {
         user.name = name;
      }

      if (password) {
         user.password = await hash(password, 8);
      }

      await userRepository.update(id || 0, user);

      return user;
   }
}