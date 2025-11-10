import {Entity, CreateDateColumn, JoinColumn, Column, ManyToOne} from "typeorm";
import entity from "./entity";
import { User } from "./user";

@Entity("log")
export default class Log extends entity {
    @CreateDateColumn()
    dataEHora!: Date;

    @Column({type: "text"})
    mensagem!: string;

    @ManyToOne(() => User)
    @JoinColumn()
    usuario!: User;
    constructor(usuario: User, mensagem: string) {
        super();
        this.usuario = usuario;
        this.mensagem = mensagem;
    }
}