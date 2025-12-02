import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import Address from "./address";
import entity from "./entity";

@Entity("guest")
export default class Guest extends entity {
  @Column()
  name!: string;

  @Column()
  dateBirth!: string;

  @Column({ unique: true })
  cpf!: string;

  @Column()
  phone!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  isActive!: boolean;

  @OneToMany(() => Address, (address) => address.guest, {
    cascade: true,
    eager: true,
  })
  addresses!: Address[];

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
    phone: string,
    email: string,
    isActive: boolean,
    addresses: Address[]
  ) {
    super();
    this.name = name;
    this.dateBirth = dateBirth;
    this.cpf = cpf;
    this.phone = phone;
    this.email = email;
    this.isActive = isActive;
    this.addresses = addresses;
  }
}
