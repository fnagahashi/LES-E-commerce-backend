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

@Entity("phone")
export default class Phone extends entity {
  @Column()
  type!: string;

  @Column()
  ddd!: string;

  @Column()
  phoneNumber!: string;

  @ManyToOne(() => Client, (client) => client.phones)
  client: Client;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  constructor(
    type: string,
    ddd: string,
    phoneNumber: string,
    client: Client,
  ) {
    super();
    this.type = type,
    this.ddd = ddd,
    this.phoneNumber = phoneNumber
    if (client) {
      this.client = client;
    }
  }
}
