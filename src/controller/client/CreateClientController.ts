import { Request, Response } from "express";
import { CreateClientService } from "../../service/Client/CreateClientService";

class CreateClientController {
  async handle(request: Request, response: Response) {
    const { name,
      dateBirth,
      cpf,
      gender,
      typePhone,
      phone,
      email,
      password,
      address,
      creditCard,
      obs, } = request.body;
    const createClientService = new CreateClientService();
   const client = await createClientService.execute(
   {
      name,
      dateBirth,
      cpf,
      gender,
      typePhone,
      phone,
      email,
      password,
      address,
      creditCard,
      obs,
    });
    response.json({message:"Cliente cadastrado!"});
  }
}
export { CreateClientController };