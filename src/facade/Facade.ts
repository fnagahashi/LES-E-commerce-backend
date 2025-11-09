import GuestDAO from "../DAO/Interface/GuestDAO";
import AddressDAO from "../DAO/Interface/AddressDAO";
import ReservationDAO from "../DAO/Interface/ReservationDAO";
import entity from "../entities/entity";
import IDAO from "../DAO/IDAO";
import IFacade from "./IFacade";
import PaymentDAO from "../DAO/Interface/PaymentDAO";
import RoomDAO from "../DAO/Interface/RoomDAO";
import IStrategy from "../strategy/IStrategy";

export default class Facade implements IFacade<entity> {
    private readonly entityDAOMap: Map<string, IDAO<entity>>;

    constructor(
        private readonly guestDAO: GuestDAO,
        private readonly addressDAO: AddressDAO,
        private readonly reservationDAO: ReservationDAO,
        private readonly paymentDAO: PaymentDAO,
        private readonly roomDAO: RoomDAO
    ) {
        this.entityDAOMap = new Map<string, IDAO<entity>>;
        this.entityDAOMap.set("Guest", this.guestDAO);
        this.entityDAOMap.set("Address", this.addressDAO);
        this.entityDAOMap.set("Reservation", this.reservationDAO);
        this.entityDAOMap.set("Payment", this.paymentDAO);
        this.entityDAOMap.set("Room", this.roomDAO);
    };

    public async create(Entity: entity, strategy: Array<IStrategy<entity>>):Promise<entity> {
        let msg: string = "";

        for 
    }

}