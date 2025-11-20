import {Entity, CreateDateColumn, JoinColumn, Column, ManyToOne} from "typeorm";
import entity from "./entity";

@Entity("log")
export default class Log extends entity {
    @CreateDateColumn()
    dataEHora!: Date;

    @Column({type: "text"})
    mensagem!: string;

    constructor( mensagem: string) {
        super();
        this.mensagem = mensagem;
    }
}