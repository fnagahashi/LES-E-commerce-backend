import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import Address from "./address";
import entity from "./entity";
import CreditCard from "./creditCard";
import { Gender } from "../enum/Gender";

@Entity("client")
export default class Client extends entity {
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

  @Column({unique: true})
  password!: string;

  @Column()
  confirmPassword!: string;

  @OneToMany(() => Address, (address) => address.client, {
    cascade: true,
    eager: true,
  })
  addresses!: Address[];

  @OneToMany(() => CreditCard, (creditCard) => creditCard.client, {
    cascade: true,
    eager: true,
  })
  creditCard!: CreditCard[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @DeleteDateColumn()
  deletedAt?: Date;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  constructor(
    name: string,
    dateBirth: string,
    cpf: string,
    gender: Gender,
    phoneDDD: string,
    phoneNumber: string,
    phoneType: string,
    email: string,
    password : string,
    confirmPassword: string,
    addresses: Address[],
    creditCard: CreditCard[],
    isActive: boolean,
  ) {
    super();
    this.name = name;
    this.dateBirth = dateBirth;
    this.cpf = cpf;
    this.gender = gender;
    this.phoneDDD = phoneDDD;
    this.phoneNumber = phoneNumber;
    this.phoneType = phoneType;
    this.email = email;
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.addresses = addresses;
    this.creditCard = creditCard;
    this.isActive = isActive;
  }
}
