import IStrategy from "../IStrategy";
import Guest from "../../entities/client";
import GuestDAO from "../../DAO/Interface/GuestDAO";

export default class ValidationUniqueCPF implements IStrategy<Guest> {
  constructor(private readonly guestDAO: GuestDAO) {}
  async executar(guest: Guest): Promise<string | undefined> {
    const cpfLimpo = guest.cpf.replace(/\D/g, "");

    const guestsExistentes = await this.guestDAO.list(
      { cpf: cpfLimpo } as Guest,
      "buscarPorCPF",
    );

    const guestExistente = guestsExistentes.find((g) => g.id !== guest.id);
    if (guestExistente) {
      return "CPF já cadastrado no sistema";
    }

    return undefined;
  }
}
