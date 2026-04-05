import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn,
} from "typeorm";
import Client from "./client";
import entity from "./entity";

@Entity("address")
export default class Address extends entity {
  @Column()
  typeResidence!: string;

  @Column({ nullable: true })
  addressNickname: string;

  @Column()
  typeStreet!: string;

  @Column()
  cep!: string;

  @Column()
  street!: string;

  @Column()
  neighborhood!: string;

  @Column()
  number!: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column()
  country!: string;

  @Column({ nullable: true })
  obs: string;

  @Column({ default: false })
  isDeliveryAddress: boolean;

  @Column({ default: false })
  isBillingAddress: boolean;

  @ManyToOne(() => Client, (client) => client.addresses)
  client?: Client;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  constructor(
    typeResidence: string,
    addressNickname: string,
    typeStreet: string,
    cep: string,
    street: string,
    neighborhood: string,
    number: string,
    city: string,
    state: string,
    country: string,
    obs: string,
    isDeliveryAddress: boolean,
    isBillingAddress: boolean,
    client?: Client,
  ) {
    super();
    this.typeResidence = typeResidence;
    this.addressNickname = addressNickname;
    this.typeStreet = typeStreet;
    this.cep = cep;
    this.street = street;
    this.neighborhood = neighborhood;
    this.number = number;
    this.city = city;
    this.state = state;
    this.country = country;
    this.obs = obs;
    this.isDeliveryAddress = isDeliveryAddress;
    this.isBillingAddress = isBillingAddress;
    if (client) {
      this.client = client;
    }
  }
}
