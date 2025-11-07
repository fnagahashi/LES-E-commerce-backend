import { Guest } from "../../entities/guest";
import { IAddressRequest } from "./IAddressInterface";

export interface IGuestRequest {
    id?: string;
    name: string;
    dateBirth: string;
    cpf: string;
    phone: string;
    email: string;
    isActive: boolean;
    addresses: IAddressRequest[];
    obs?: string;
}

export interface IGuestDAO{
    findById(id: string): Promise<Guest | null>;
  findByEmail(email: string): Promise<Guest | null>;
  findByCPF(cpf: string): Promise<Guest | null>;
  findAll(): Promise<Guest[]>;
  create(guest: IGuestRequest): Promise<Guest>;
  update(id: string, guest: Partial<IGuestRequest>): Promise<Guest>;
  updateStatus(id: string, isActive: boolean): Promise<void>;findWithAddresses(id: string): Promise<Guest | null>;
  findByStatus(isActive: boolean): Promise<Guest[]>;
  searchByName(name: string): Promise<Guest[]>;
}