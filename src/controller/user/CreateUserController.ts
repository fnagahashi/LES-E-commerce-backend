import { Request, Response } from "express";
import { CreateUserService } from "../../service/User/CreateUserService";

class CreateUserController {
  async handle(request: Request, response: Response) {
    const { name, email, admin, password } = request.body;
    const createUserService = new CreateUserService();
   const user = await createUserService.execute(
   {
      name:name,
      email:email,
      admin:admin,
      password:password
    }); 
    response.json(user);
  }
}
export { CreateUserController };