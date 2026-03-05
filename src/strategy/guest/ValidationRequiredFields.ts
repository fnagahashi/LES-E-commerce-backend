import IStrategy from "../IStrategy";
import Guest from "../../entities/client";
import address from "../../entities/address";

export default class ValidationRequiredGuestFields implements IStrategy<Guest> {
  async executar(guest: Guest): Promise<string | undefined> {
    const errors: string[] = [];

    if (!guest.name?.trim()) {
      errors.push("Nome completo é obrigatório");
    }

    if (!guest.cpf?.trim()) {
      errors.push("CPF é obrigatório");
    }

    if (!guest.dateBirth) {
      errors.push("Data de nascimento é obrigatória");
    }

    if (!guest.phone?.trim()) {
      errors.push("Telefone é obrigatório");
    }

    if (!guest.email?.trim()) {
      errors.push("E-mail é obrigatório");
    }

    if (!guest.addresses || guest.addresses.length === 0) {
      errors.push("Pelo menos um endereço é obrigatório");
    }

    return errors.length > 0 ? errors.join(", ") : undefined;
  }
}
