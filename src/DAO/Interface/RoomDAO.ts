import { Connection, Like, Repository } from "typeorm";
import entity from "../../entities/entity";
import IDAO from "../IDAO";
import Room from "../../entities/room";

export default class RoomDAO implements IDAO<Room> {
  private dataSource: Connection;
  private repository: Repository<Room>;

  constructor(dataSource: Connection) {      
    this.dataSource = dataSource;
    this.repository = this.dataSource.getRepository(Room);
  }

  async create(room: Room): Promise<Room> {
    return await this.repository.save(room);
  }

  async list(room: Room, operation: string): Promise<Room[]> {
    switch (operation) {
      case "findAll":
        return await this.repository.find({
          where: {isActive: true}, 
        });
      case "findById":
        return await this.repository.find({
          where: {id: room.id}, 
        });
      case "findByFilters":
        const code = room.roomCode ? Like(`%${room.roomCode}%`) : Like(`%`);
        const type = room.type ? Like(`%${room.type}%`) : Like(`%`);
        return await this.repository.find({
          where: {
            roomCode: code,
            type: room.type
          }
        });
      
      default:
        throw new Error("Operation not supported");
    }
  }

  async update(room: Room): Promise<Room> {
    const roomExists = await this.list(room, "findById");
    if (!roomExists) {
      throw new Error("Quarto não encontrado");
    }
    const updatedRoom = this.repository.merge(roomExists[0], room);
    return await this.repository.save(updatedRoom);
  }

  async delete(room: Room): Promise<void> {
    await this.repository.softDelete(room.id);
  }
}