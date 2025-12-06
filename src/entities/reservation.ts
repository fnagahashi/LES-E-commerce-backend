import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  UpdateDateColumn,
} from "typeorm";
import Guest from "./guest";
import Room from "./room";
import entity from "./entity";
import Sale from "./sale";
import Policy from "./policy";

@Entity("reservation")
export default class Reservation extends entity {
  @Column()
  codeReservation: string;
  @BeforeInsert()
  generateCodeReservation() {
    this.codeReservation = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();
  }

  @ManyToOne(() => Guest)
  @JoinColumn({ name: "guestId" })
  guest: Guest;

  @Column()
  guestId: string;

  @ManyToOne(() => Room)
  @JoinColumn({ name: "roomId" })
  room: Room;

  @Column()
  roomId: string;

  @Column("date")
  dateStart: Date;

  @Column("date")
  dateEnd: Date;

  @Column({ nullable: true, default: false })
  noShow: boolean;

  @Column()
  qntAdults: number;

  @Column()
  qntChildren: number;

  @Column("simple-array", { nullable: true })
  childrenAges: number[];

  @OneToOne(() => Sale)
  @JoinColumn()
  sale: Sale;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  constructor(
    guestId: string,
    roomId: string,
    dateStart: Date,
    dateEnd: Date,
    noShow: boolean,
    qntAdults: number,
    qntChildren: number,
    childrenAges: number[]
  ) {
    super();
    this.guestId = guestId;
    this.roomId = roomId;
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.noShow = noShow;
    this.qntAdults = qntAdults;
    this.qntChildren = qntChildren;
    this.childrenAges = childrenAges || [];
  }
}
