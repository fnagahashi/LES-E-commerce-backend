import {
  Column,
  Entity,
  ManyToOne,
} from "typeorm";

import entity from "./entity";
import ChatSession from "./chatSession";

@Entity("chatMessage")
export default class ChatMessage
extends entity {

  @ManyToOne(
    () => ChatSession,
    (session) => session.messages
  )
  session!: ChatSession;

  @Column()
  role!: string;

  @Column("text")
  message!: string;

  @Column()
  createdAt!: Date;
}