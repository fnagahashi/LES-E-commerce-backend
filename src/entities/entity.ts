import { PrimaryGeneratedColumn, Column } from "typeorm";

export default abstract class entity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

}