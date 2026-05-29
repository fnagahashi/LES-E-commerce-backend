import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
} from "typeorm";

import entity from "./entity";
import Client from "./client";
import ChatMessage from "./chatMessage";

@Entity("chatSession")
export default class ChatSession
  extends entity {

  @ManyToOne(
    () => Client,
    (client) => client.chatSessions,
    {
      onDelete: "CASCADE",
    }
  )
  client!: Client;

  @OneToMany(
    () => ChatMessage,
    (message) => message.session,
    {
      cascade: true,
    }
  )
  messages!: ChatMessage[];

  @Column({
    default: true,
  })
  active!: boolean;

  @CreateDateColumn()
  startedAt!: Date;
}