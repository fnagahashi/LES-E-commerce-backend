import { DataSource, Repository } from "typeorm";
import ChatSession from "../../entities/chatSession";

export default class ChatSessionDAO {
  private repository: Repository<ChatSession>;

  constructor(connection: DataSource) {
    this.repository = connection.getRepository(ChatSession);
  }

  async findActiveByClient(clientId: string) {
    return this.repository.findOne({
      where: {
        client: { id: clientId },
        active: true,
      },
      relations: ["messages"],
    });
  }

  async create(session: ChatSession) {
    return this.repository.save(session);
  }

  async update(session: ChatSession) {
    return this.repository.save(session);
  }
}
