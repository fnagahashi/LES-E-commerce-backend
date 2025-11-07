import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import{v4 as uuid} from "uuid";
import { Address } from "./address";
import entity from "./entity";

@Entity("policy")
export default class Policy extends entity{
    @Column()
    description: string;

    @Column()
    percentual: number;

    @DeleteDateColumn()
    deletedAt?: Date;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    constructor(
        description: string,
        percentual: number,
    ){
        super();
        this.description = description;
        this.percentual = percentual;
    }
}

export { Policy };