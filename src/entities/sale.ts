import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import{v4 as uuid} from "uuid";
import { Address } from "./address";
import entity from "./entity";

@Entity("sale")
export default class Sale extends entity{
    @Column()
    description: string;

    @DeleteDateColumn()
    deletedAt?: Date;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    constructor(
        description: string,
    ){
        super();
        this.description = description;
    }
}

export { Sale };