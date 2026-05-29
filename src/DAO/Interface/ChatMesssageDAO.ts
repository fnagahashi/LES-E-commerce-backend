import { DataSource, Repository } from "typeorm";

import ChatMessage from "../../entities/chatMessage";

export default class ChatMessageDAO {
  private repository: Repository<ChatMessage>;

  constructor(connection: DataSource) {
    this.repository = connection.getRepository(ChatMessage);
  }

  async create(message: ChatMessage) {
    return this.repository.save(message);
  }
}
