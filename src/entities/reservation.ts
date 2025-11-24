import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Guest } from "./guest";
import { Room } from "./room";
import entity from "./entity";

type PaymentStatus = 'pending' | 'denied' | 'approved' | 'confirmed' | 'cancelled' | 'proposal';

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
    qntAdults: number;

    @Column()
    qntChildren: number;

    @Column('simple-array', { nullable: true })
    childrenAges!: number[];

    @Column('decimal', { precision: 10, scale: 2 })
    priceTotal: number;

    @Column()
    paymentStatus: PaymentStatus;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
    payment: any;

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
        priceTotal: number,
        paymentStatus: PaymentStatus='proposal'
    ){
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
        this.priceTotal = priceTotal;
        this.paymentStatus = paymentStatus;
    }
    isPaid(): boolean {
        return this.paymentStatus === 'approved' || this.paymentStatus === 'confirmed';
    }

    canBeConfirmed(): boolean {
        return this.paymentStatus === 'approved';
    }
}

export { Reservation, type PaymentStatus };