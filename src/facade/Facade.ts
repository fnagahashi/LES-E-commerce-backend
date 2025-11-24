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
import Log from "../entities/log";
import ValidationRequiredGuestFields from "../strategy/guest/ValidationRequiredFields";
import ValidationRequiredAddressFields from "../strategy/address/ValidationRequiredFields";
import ValidationEmail from "../strategy/guest/ValidationEmail";
import ValidationUniqueCPF from "../strategy/guest/ValidationCPFUniqueness";
import ValidationCPF from "../strategy/guest/ValidationCPF";
import ValidationRequiredRoomFields from "../strategy/room/ValidationRequiredFields";
import ValidationAvailabilityRoom from "../strategy/reservation/ValidationAvailabilityRoom";
import ValidationDates from "../strategy/reservation/ValidationDates";
import ValidationCapacityRoom from "../strategy/reservation/ValidationCapacityRoom";
import ValidationCapacity from "../strategy/reservation/ValidationCapacity";
import ValidationMinimumStay from "../strategy/reservation/ValidationMinimumStay";
import CancellationPolicy from "../strategy/others/CancellationPolicy";
import ChildrenDiscountStrategy from "../strategy/others/ChildrenDiscount";
import PromotionValidation from "../strategy/others/PromotionValidation";
import SaleDAO from "../DAO/Interface/SaleDAO";
import ValidationRequiredPaymentFields from "../strategy/payment/ValidationRequiredFields";
import ValidationReservationConfirm from "../strategy/payment/ValidationReservationConfirm";

export default class Facade implements IFacade<entity> {
    private readonly entityDAOMap: Map<string, IDAO<entity>>;
    private readonly strategyMap: Map<string, Array<IStrategy<entity>>>;

    private async gerarLog(entity: entity, acao: string): Promise<void> {
        const logDAO = this.entityDAOMap.get('Log') as IDAO<Log>;
        if (logDAO) {
            const mensagem = `${entity.constructor.name} ${acao}: ${JSON.stringify(entity)}`;
            const logEntry = new Log(mensagem);
            await logDAO.create(logEntry);
        }
    }

    constructor(
        private readonly guestDAO: GuestDAO,
        private readonly addressDAO: AddressDAO,
        private readonly reservationDAO: ReservationDAO,
        private readonly paymentDAO: PaymentDAO,
        private readonly roomDAO: RoomDAO,
        private readonly logDAO: LogDAO,
        private readonly saleDAO: SaleDAO
    ) {
        this.entityDAOMap = new Map<string, IDAO<entity>>;
        this.entityDAOMap.set("Guest", this.guestDAO);
        this.entityDAOMap.set("Address", this.addressDAO);
        this.entityDAOMap.set("Reservation", this.reservationDAO);
        this.entityDAOMap.set("Payment", this.paymentDAO);
        this.entityDAOMap.set("Room", this.roomDAO);
        this.entityDAOMap.set('Log', this.logDAO);
        this.entityDAOMap.set('Sale', this.saleDAO);
        this.strategyMap = new Map<string, Array<IStrategy<entity>>>();
        this.initializeStrategies();
    }

    private initializeStrategies(): void {
        this.strategyMap.set("Guest", [
            new ValidationRequiredGuestFields(),
            new ValidationEmail(),
            new ValidationCPF(),
            new ValidationUniqueCPF(this.guestDAO)
        ] as Array<IStrategy<entity>>);

        this.strategyMap.set("Address", [
            new ValidationRequiredAddressFields()
        ] as Array<IStrategy<entity>>);

        this.strategyMap.set("Room", [
            new ValidationRequiredRoomFields()
        ] as Array<IStrategy<entity>>);

        this.strategyMap.set("Reservation", [
            new ValidationAvailabilityRoom(this.reservationDAO),
            new ValidationMinimumStay(),
            new ValidationCapacity(),
            new ValidationCapacityRoom(),
            new ValidationDates(),
            new ValidationRequiredRoomFields(),
            new CancellationPolicy(),
            new ChildrenDiscountStrategy(),
        ] as Array<IStrategy<entity>>);

        this.strategyMap.set("Sale",[
            new PromotionValidation(this.saleDAO)
        ] as Array<IStrategy<entity>>);

        this.strategyMap.set("Payment", [
            new ValidationRequiredPaymentFields(),
            new ValidationReservationConfirm(this.reservationDAO)
        ] as Array<IStrategy<entity>>);
    }

    public async create(entity: entity):Promise<entity> {
        const entityName = entity.constructor.name;
        
        const strategies = this.strategyMap.get(entityName) || [];
        
        let msg: string = "";

        for (const strategy of strategies) {
            const resultado = await strategy.executar(entity);
            if (resultado) {
                msg += resultado + " ";
            }     
        }
        
        if (msg) {
            throw new Error(msg.trim());
        }

        const entidadeDAO = this.entityDAOMap.get(entityName);
        if (!entidadeDAO) {
            throw new Error(`DAO não encontrado para entidade: ${entityName}`);
        }

        const entidadeCriada = await entidadeDAO.create(entity);
        
        await this.gerarLog(entidadeCriada, "criado");

        return entidadeCriada;
    }

    public async update(entity: entity): Promise<entity> {
        const entityName = entity.constructor.name;
        
        const strategies = this.strategyMap.get(entityName) || [];
        
        let msg: string = "";

        for (const strategy of strategies) {
            const resultado = await strategy.executar(entity);
            if (resultado) {
                msg += resultado + " ";
            }     
        }
        
        if (msg) {
            throw new Error(msg.trim());
        }

        const entidadeDAO = this.entityDAOMap.get(entityName);
        if (!entidadeDAO) {
            throw new Error(`DAO não encontrado para entidade: ${entityName}`);
        }

        const entidadeAtualizada = await entidadeDAO.update(entity);
        await this.gerarLog(entidadeAtualizada, "atualizado");

        return entidadeAtualizada;
    }

    public async delete(entity: entity): Promise<entity> {
        const entityName = entity.constructor.name;
        const entidadeDAO = this.entityDAOMap.get(entityName);
        
        if (!entidadeDAO) {
            throw new Error(`DAO não encontrado para entidade: ${entityName}`);
        }

        const entidadeParaDeletar = { ...entity };
        
        await entidadeDAO.delete(entity);
        await this.gerarLog(entidadeParaDeletar, "deletado");

        return entidadeParaDeletar;
    }

    public async list(entity: entity, operation: string): Promise<entity[]> {
        const entityName = entity.constructor.name;
        const entidadeDAO = this.entityDAOMap.get(entityName);
        
        if (!entidadeDAO) {
            throw new Error(`DAO não encontrado para entidade: ${entityName}`);
        }

        const entidades = await entidadeDAO.list(entity, operation);
        
        if (entidades.length > 0) {
            await this.gerarLog(entity, `listado - operação: ${operation}`);
        }

        return entidades;
    }

}