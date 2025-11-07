import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn, BeforeInsert} from "typeorm";
import{v4 as uuid} from "uuid";
import { RoomType } from "../enum/RoomType";
import entity from "./entity";

@Entity("room")
export default class Room extends entity{
    @Column({ 
        type: 'varchar', 
        length: 5,
        unique: true 
    })
    roomCode: string;

    @BeforeInsert()
    generateNumericCode() {
        if (!this.roomCode) {
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            this.roomCode = randomNum.toString();
        }
    }

    @Column({type: "enum", enum: RoomType})
    type: RoomType;

    @Column()
    isActive: boolean;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    constructor(
        code: string,
        type: RoomType,
        isActive: boolean
    ){
        super();
        this.roomCode = code;
        this.type = type;
        this.isActive = isActive;
    }
}

export {Room};