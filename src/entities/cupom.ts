import { Column, Entity, ManyToOne } from "typeorm";
import entity from "./entity";
import { CupomType } from "../enum/CupomType";
import Client from "./client";

@Entity("cupom")
export default class Cupom extends entity {
  @ManyToOne(() => Client, (client) => client.cupons, { nullable: true })
  client?: Client;

  @Column()
  cupomCode: string;

  @Column()
  cupomValue: number;

  @Column()
  isActive: boolean;

  @Column()
  cupomType: CupomType;

  @Column()
  used: boolean;

  constructor(
    cupomCode: string,
    cupomValue: number,
    isActive: boolean,
    cupomType: CupomType,
    used: boolean,
    client?: Client,
  ) {
    super();
    this.cupomCode = cupomCode;
    this.cupomValue = cupomValue;
    this.isActive = isActive;
    this.cupomType = cupomType;
    this.used = used;
    if (client) this.client = client;
  }
}
