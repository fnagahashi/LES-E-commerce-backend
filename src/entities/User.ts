import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import{v4 as uuid} from "uuid";
import entity from "./entity";

@Entity("users")
export default class User extends entity{
    @Column()
    name!: string;

    @Column()
    email!: string;

    @Column()
    admin!: boolean;

    @Column()
    password!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    constructor(
        name: string,
        email: string,
        admin: boolean,
        password: string
    ){
        super();
        this.name = name;
        this.email = email;
        this.admin = admin;
        this.password = password;
    }
}

export {User};