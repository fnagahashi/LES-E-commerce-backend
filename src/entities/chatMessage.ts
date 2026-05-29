import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
} from "typeorm";

import entity from "./entity";
import ChatSession from "./chatSession";
import { RoleMessage } from "../enum/RoleMessage";

@Entity("chatMessage")
export default class ChatMessage
extends entity {

  @ManyToOne(
    () => ChatSession,
    (session) => session.messages
  )
  session!: ChatSession;

  @Column({
  type: "enum",
  enum: RoleMessage,
})
role!: RoleMessage;

  @Column("text")
  message!: string;

  @CreateDateColumn()
  createdAt!: Date;
}