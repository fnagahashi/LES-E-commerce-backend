import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import{v4 as uuid} from "uuid";
import { Guest } from "./guest";
import { Room } from "./room";
import entity from "./entity";

@Entity("reservation")
export default class Reservation extends entity{
    @Column()
    codeReservation!: string;

    @ManyToOne(() => Guest)
    guest: Guest;

    @ManyToOne(() => Room)
    room: Room;

    @Column('date')
    dateStart: Date;

    @Column('date')
    dateEnd: Date;

    @Column()
    noShow: boolean;

    @Column()
    qntAldults: number;

    @Column()
    qntChildren: number;

    @Column('decimal', { precision: 10, scale: 2 })
    priceTotal: number;

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
        qntAldults: number,
        qntChildren: number,
        priceTotal: number
    ){
        super();
        this.codeReservation = codeReservation;
        this.guest = guest;
        this.room = room;
        this.dateStart = dateStart;
        this.dateEnd = dateEnd;
        this.noShow = noShow;
        this.qntAldults = qntAldults;
        this.qntChildren = qntChildren;
        this.priceTotal = priceTotal;
    }
}

export {Reservation};