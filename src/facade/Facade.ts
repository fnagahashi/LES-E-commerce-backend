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
import GuestRequiredFieldsStrategy from "../strategy/guest/ValidationRequiredFields";

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
        private readonly logDAO: LogDAO
    ) {
        this.entityDAOMap = new Map<string, IDAO<entity>>;
        this.entityDAOMap.set("Guest", this.guestDAO);
        this.entityDAOMap.set("Address", this.addressDAO);
        this.entityDAOMap.set("Reservation", this.reservationDAO);
        this.entityDAOMap.set("Payment", this.paymentDAO);
        this.entityDAOMap.set("Room", this.roomDAO);
        this.entityDAOMap.set('Log', this.logDAO);
        this.strategyMap = new Map<string, Array<IStrategy<entity>>>();
        this.initializeStrategies();
    }

    private initializeStrategies(): void {
        this.strategyMap.set("Guest", [
            new GuestRequiredFieldsStrategy(),
            new GuestEmailValidationStrategy(),
            new GuestCPFUniquenessStrategy(this.guestDAO)
        ] as Array<IStrategy<entity>>);

    }

    public async create(entity: entity, strategy: Array<IStrategy<entity>>):Promise<entity> {
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

        const entidadeDAO = this.entityDAOMap.get(entity.constructor.name);
        if (!entidadeDAO) {
            throw new Error('Entidade não encontrada');
        }

        const entidadeCriada = await entidadeDAO.create(entity);
        
        this.gerarLog(entidadeCriada, "criado");

        return entidadeCriada;
    }

    public async update(entity: entity, strategy: Array<IStrategy<entity>>): Promise<entity> {
        let msg: string = "";

        for (const s of strategy) {
            const resultado = await s.executar(entity);
            if (resultado) {
                msg += resultado + " ";
            }     
        }
        
        if (msg) {
            throw new Error(msg.trim());
        }

        const entityName = entity.constructor.name;
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