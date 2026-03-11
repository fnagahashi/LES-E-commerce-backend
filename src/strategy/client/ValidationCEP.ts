import IStrategy from "../IStrategy";
import Client from "../../entities/client";
import Address from "../../entities/address";

export default class ValidationCPF implements IStrategy<Client> {
  async executar(client: Client): Promise<string | undefined> {
  }
}
