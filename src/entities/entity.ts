import { PrimaryGeneratedColumn } from "typeorm";

export default abstract class entity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
}