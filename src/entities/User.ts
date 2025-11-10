import {Entity, Column} from "typeorm";
import entity from "./entity";

@Entity("user")
export default class User extends entity {
    @Column({type: "varchar"})
    email!: string;

    @Column({type: "varchar"})
    senha!: string;

    @Column({type: "varchar"})
    senhaConfirmacao!: string;

    @Column({type: "boolean", default: false})
    isAdmin!: boolean;

    constructor(email: string, nome: string, senha?: string, senhaConfirmacao?: string, isAdmin?: boolean) {
        super();
        this.email = email;
        this.senha = senha || "";
        this.senhaConfirmacao = senhaConfirmacao || "";
        this.isAdmin = isAdmin || false;
    }

}