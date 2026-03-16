import IStrategy from "../IStrategy";
import Client from "../../entities/client";
import { EncryptionUtil } from "../../utils/encryption";

export default class EncryptPassword implements IStrategy<Client> {
    async executar(client: Client): Promise<string | undefined> {
        if (client.password) {
            client.password = await EncryptionUtil.criptografar(client.password);
        }
        return null;
    }
}