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
import Phone from "./phone";
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

  @OneToMany(() => Phone, (phone) => phone.client, {
    cascade: true,
    eager: true,
  })
  phones!: Phone[];

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
    phones: Phone[],
    email: string,
    password,
    confirmPassword,
    addresses: Address[],
    creditCard: CreditCard[]
  ) {
    super();
    this.name = name;
    this.dateBirth = dateBirth;
    this.cpf = cpf;
    this.gender = gender;
    this.phones = phones;
    this.email = email;
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.addresses = addresses;
    this.creditCard = creditCard;
  }
}
