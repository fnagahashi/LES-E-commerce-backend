import { Column, Entity } from "typeorm";
import entity from "./entity";
import { CupomType } from "../enum/CupomType";

@Entity("cupom")
export default class Cupom extends entity {
  @Column()
  cupomCode: string;

  @Column()
  cupomValue: string;

  @Column()
  isActive: boolean;

  @Column()
  cupomType: CupomType;

  constructor(
    cupomCode: string,
    cupomValue: string,
    isActive: boolean,
    cupomType: CupomType,
  ) {
    super();
    this.cupomCode = cupomCode;
    this.cupomValue = cupomValue;
    this.isActive = isActive;
    this.cupomType = cupomType;
  }
}
