import { RoomType } from "../../enum/RoomType";

interface IRoomRequest {
    id?: string;
    roomCode: string;
    isActive: boolean;
    type: RoomType;
}

export { IRoomRequest }