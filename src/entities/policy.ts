import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  UpdateDateColumn,
} from "typeorm";
import entity from "./entity";
import Reservation from "./reservation";

@Entity("policy")
export default class Policy extends entity {
  @Column()
  description: string;

  @Column()
  percentual: number;

  @OneToOne(() => Reservation, (reservation) => reservation.policy)
  reservation: Reservation;

  @DeleteDateColumn()
  deletedAt?: Date;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  constructor(description: string, percentual: number) {
    super();
    this.description = description;
    this.percentual = percentual;
  }
}
