import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { RoomType } from "../enum/RoomType";
import entity from "./entity";

@Entity("room")
export default class Room extends entity {
  @Column({
    type: "varchar",
    length: 5,
    unique: true,
  })
  roomCode: string;

  @BeforeInsert()
  generateNumericCode() {
    if (!this.roomCode) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      this.roomCode = randomNum.toString();
    }
  }

  @Column({ type: "enum", enum: RoomType })
  type: RoomType;

  @Column()
  qntdAdultos: number;

  @Column()
  qntdCriancas: number;

  @Column("decimal", { precision: 10, scale: 2 })
  precoBase: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  constructor(
    code: string,
    type: RoomType,
    qntdAdultos: number,
    qntdCriancas: number,
    precoBase: number,
    isActive: boolean
  ) {
    super();
    this.roomCode = code;
    this.type = type;
    this.qntdAdultos = qntdAdultos;
    this.qntdCriancas = qntdCriancas;
    this.precoBase = precoBase;
    this.isActive = isActive;
  }
}
