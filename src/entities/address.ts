import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { Guest } from "./guest";
import entity from "./entity";

@Entity("address")
export default class Address extends entity{
    @Column()
    cep!: string;

    @Column()
    street!: string;

    @Column()
    neighborhood!: string;

    @Column()
    number!: string;

    @Column()
    city!: string;

    @Column()
    state!: string;

    @Column({ nullable: true })
    obs: string;

    @ManyToOne(() => Guest, guest => guest.addresses)
    guest: Guest;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    constructor(
        cep: string,
        street: string,
        neighborhood: string,
        number: string,
        city: string,
        state: string,
        obs: string,
        guest?: Guest
    ) {
        super();
        this.cep = cep;
        this.street = street;
        this.neighborhood = neighborhood;
        this.number = number;
        this.city = city;
        this.state = state;
        this.obs = obs;
        if(guest) {
            this.guest = guest;
        }
    }
}

export { Address };