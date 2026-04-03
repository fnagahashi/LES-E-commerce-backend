import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import Address from "./address";
import entity from "./entity";
import CreditCard from "./creditCard";
import { Gender } from "../enum/Gender";
import { Role } from "../enum/Role";
import Order from "./order";
import Cupom from "./cupom";

@Entity("client")
export default class Client extends entity {
  @Column({
    type: "enum",
    enum: Object.values(Role),
    default: Role.CLIENT,
  })
  role!: Role;
  @Column()
  name!: string;

  @Column()
  dateBirth!: string;

  @Column({ unique: true })
  cpf!: string;

  @Column()
  gender!: Gender;

  @Column()
  phoneDDD!: string;

  @Column()
  phoneNumber!: string;

  @Column()
  phoneType!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  password!: string;

  @OneToMany(() => Address, (address) => address.client, {
    cascade: true,
    eager: true,
    orphanedRowAction: "delete",
  })
  addresses!: Address[];

  @OneToMany(() => CreditCard, (creditCard) => creditCard.client, {
    cascade: true,
    eager: true,
    orphanedRowAction: "delete",
  })
  creditCard!: CreditCard[];

  @Column({ type: "boolean", default: true })
  isActive: boolean;

  @OneToMany(() => Order, (order) => order.client)
  order: Order[];

  @OneToMany(() => Cupom, (cupom) => cupom.client)
  cupons: Cupom[];

  @DeleteDateColumn()
  deletedAt?: Date;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  constructor(
    role: Role = Role.CLIENT,
    name: string,
    dateBirth: string,
    cpf: string,
    gender: Gender,
    phoneDDD: string,
    phoneNumber: string,
    phoneType: string,
    email: string,
    password: string,
    addresses: Address[],
    creditCard: CreditCard[],
    isActive: boolean,
    order: Order[],
    cupons: Cupom[],
  ) {
    super();
    this.role = role;
    this.name = name;
    this.dateBirth = dateBirth;
    this.cpf = cpf;
    this.gender = gender;
    this.phoneDDD = phoneDDD;
    this.phoneNumber = phoneNumber;
    this.phoneType = phoneType;
    this.email = email;
    this.password = password;
    this.addresses = addresses;
    this.creditCard = creditCard;
    this.isActive = isActive;
    this.order = order;
    this.cupons = cupons;
  }
}
