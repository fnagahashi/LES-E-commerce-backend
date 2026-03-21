import IStrategy from "../IStrategy";
import Client from "../../entities/client";

export default class ValidationRequiredClientFields
  implements IStrategy<Client>
{
  async executar(client: Client): Promise<string | undefined> {
    const errors: string[] = [];

    if (!client.name?.trim()) {
      errors.push("Nome completo é obrigatório");
    }

    if (!client.cpf?.trim()) {
      errors.push("CPF é obrigatório");
    }

    if (!client.dateBirth) {
      errors.push("Data de nascimento é obrigatória");
    }

    if (!client.gender) {
      errors.push("Gênero é obrigatório");
    }

    if (
      !client.phoneDDD.trim() ||
      !client.phoneNumber.trim() ||
      !client.phoneType.trim()
    ) {
      errors.push("Telefone é obrigatório");
    }

    if (!client.email?.trim()) {
      errors.push("E-mail é obrigatório");
    }

    if (!client.password.trim()) {
      errors.push("Senha é obrigatória");
    }

    if (!client.addresses || client.addresses.length === 0) {
      errors.push("Pelo menos um endereço é obrigatório");
    }

    if (!client.creditCard || client.creditCard.length === 0) {
      errors.push("Pelo menos um cartão de crédito é obrigatório");
    }

    return errors.length > 0 ? errors.join(", ") : undefined;
  }
}
