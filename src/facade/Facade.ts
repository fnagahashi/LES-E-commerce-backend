import GuestDAO from "../DAO/Interface/GuestDAO";
import AddressDAO from "../DAO/Interface/AddressDAO";
import ReservationDAO from "../DAO/Interface/ReservationDAO";
import entity from "../entities/entity";
import IDAO from "../DAO/IDAO";
import IFacade from "./IFacade";
import PaymentDAO from "../DAO/Interface/PaymentDAO";
import RoomDAO from "../DAO/Interface/RoomDAO";
import IStrategy from "../strategy/IStrategy";
import LogDAO from "../DAO/Interface/LogDAO";

export default class Facade implements IFacade<entity> {
    private readonly entityDAOMap: Map<string, IDAO<entity>>;

    constructor(
        private readonly guestDAO: GuestDAO,
        private readonly addressDAO: AddressDAO,
        private readonly reservationDAO: ReservationDAO,
        private readonly paymentDAO: PaymentDAO,
        private readonly roomDAO: RoomDAO,
        private readonly logDAO: LogDAO
    ) {
        this.entityDAOMap = new Map<string, IDAO<entity>>;
        this.entityDAOMap.set("Guest", this.guestDAO);
        this.entityDAOMap.set("Address", this.addressDAO);
        this.entityDAOMap.set("Reservation", this.reservationDAO);
        this.entityDAOMap.set("Payment", this.paymentDAO);
        this.entityDAOMap.set("Room", this.roomDAO);
        this.entityDAOMap.set('Log', this.logDAO);
    };

    public async create(entity: Entity, strategy: Array<IStrategy<Entity>>):Promise<Entity> {
        let msg: string = "";

        for (const s of strategy) {
            const resultado = await s.executar(entity);
            if (resultado) {
                msg += resultado + " ";
            }     
        }
        if (msg) {
            throw new Error(msg);
        }

        const entidadeDAO = this.entityDAOMap.get(Entity.constructor.name);
        if (!entidadeDAO) {
            throw new Error('Entidade não encontrada');
        }

        const entidadeCriada = await entidadeDAO.create(Entity);
        
        this.gerarLog(entidadeCriada, "criado");

        return entidadeCriada;
    }

}