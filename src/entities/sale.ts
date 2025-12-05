import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import entity from "./entity";
import Reservation from "./reservation";

export type TipoPromocao = "percentual" | "valor_fixo" | "diaria_gratis";
@Entity("sale")
export default class Sale extends entity {
  @Column()
  codigoSale!: string;

  @Column()
  description: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({
    type: "enum",
    enum: ["percentual", "valor_fixo", "diaria_gratis"],
    default: "percentual",
  })
  tipo!: TipoPromocao;

  @Column("decimal", { precision: 10, scale: 2 })
  valor: number;

  @Column()
  validoAte!: Date;

  @Column({ default: false })
  acumulativa!: boolean;

  @Column({ default: true })
  ativa!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  constructor(
    codigoSale: string,
    description: string,
    tipo: TipoPromocao,
    valor: number,
    validoAte: Date,
    acumulativa: boolean = false,
    ativa: boolean = true
  ) {
    super();
    this.codigoSale = codigoSale;
    this.description = description;
    this.tipo = tipo;
    this.valor = valor;
    this.validoAte = validoAte;
    this.acumulativa = acumulativa;
    this.ativa = ativa;
  }

  promoAtiva(): boolean {
    return this.ativa && !this.deletedAt && this.validoAte >= new Date();
  }

  calcularDesconto(valorTotal: number, diarias: number): number {
    const valorDiaria = valorTotal / diarias;

    switch (this.tipo) {
      case "percentual":
        return valorTotal * (this.valor / 100);

      case "valor_fixo":
        return this.valor;

      case "diaria_gratis":
        return valorTotal - valorDiaria;

      default:
        return 0;
    }
  }
}
