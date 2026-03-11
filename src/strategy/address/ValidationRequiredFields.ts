import IStrategy from "../IStrategy";
import Address from "../../entities/address";

export default class ValidationRequiredAddressFields implements IStrategy<Address> {
    async executar(address: Address): Promise<string | undefined> {
        const errors: string[] = [];

        if(!address.typeResidence?.trim()) errors.push("Tipo de Residência é obrigatório")
        if (!address.cep?.trim()) errors.push("CEP é obrigatório");
        if (!address.street?.trim()) errors.push("Rua é obrigatória");
        if (!address.neighborhood?.trim()) errors.push("Bairro é obrigatório");
        if (!address.number?.trim()) errors.push("Número é obrigatório");
        if (!address.city?.trim()) errors.push("Cidade é obrigatória");
        if (!address.state?.trim()) errors.push("Estado é obrigatório");

        return errors.length > 0 ? errors.join(", ") : undefined;
    }
}