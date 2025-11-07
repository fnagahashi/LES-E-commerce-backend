import { IGuestRequest } from "./GuestDAO";

interface IAddressRequest {
    id?: string;
    cep: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    number: string;
    obs?: string;
    guestId?: string;
}

export { IAddressRequest }