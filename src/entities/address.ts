import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import Client from "./client";
import entity from "./entity";

@Entity("address")
export default class Address extends entity {
  @Column()
  typeResidence!: string;

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

  @ManyToOne(() => Client, (guest) => guest.addresses)
  client: Client;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  constructor(
    cep: string,
    street: string,
    neighborhood: string,
    number: string,
    city: string,
    state: string,
    obs: string,
    client?: Client,
  ) {
    super();
    this.cep = cep;
    this.street = street;
    this.neighborhood = neighborhood;
    this.number = number;
    this.city = city;
    this.state = state;
    this.obs = obs;
    if (client) {
      this.client = client;
    }
  }
}
