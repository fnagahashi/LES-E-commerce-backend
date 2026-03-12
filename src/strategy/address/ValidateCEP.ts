import axios from "axios";
import Address from "../../entities/address";
import IStrategy from "../IStrategy";

export default class ValidationCEP implements IStrategy<Address> {

  async executar(address: Address): Promise<string | null> {

    const cep = address.cep?.replace(/\D/g, "");

    if (!cep || cep.length !== 8) {
      return "CEP inválido";
    }

    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${cep}/json/`
      );

      if (response.data.erro) {
        return "CEP não encontrado";
      }

      return null;

    } catch (error) {
      return "Erro ao validar CEP";
    }
  }
}