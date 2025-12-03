import {
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
import Payment from "./payment";


@Entity("reservation")
export default class Reservation extends entity {
  @Column()
  codeReservation!: string;

  @ManyToOne(() => Guest)
  guest: Guest;

  @ManyToOne(() => Room)
  room: Room;

  @Column("date")
  dateStart: Date;

  @Column("date")
  dateEnd: Date;

  @Column()
  noShow: boolean;

  @Column()
  qntAdults: number;

  @Column()
  qntChildren: number;

  @Column("simple-array", { nullable: true })
  childrenAges!: number[];

  @OneToOne(() => Sale)
  @JoinColumn()
  sale: Sale;

  @OneToOne(() => Policy, { 
    nullable: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  policy: Policy;   
  
  @OneToOne(() => Payment, (payment) => payment.reservation)
  payment: Payment;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  constructor(
    codeReservation: string,
    guest: Guest,
    room: Room,
    dateStart: Date,
    dateEnd: Date,
    noShow: boolean,
    qntAdults: number,
    qntChildren: number,
    childrenAges: number[],
  ) {
    super();
    this.codeReservation = codeReservation;
    this.guest = guest;
    this.room = room;
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.noShow = noShow;
    this.qntAdults = qntAdults;
    this.qntChildren = qntChildren;
    this.childrenAges = childrenAges || [];
  }
  
}
