import IDAO from "../IDAO";
import { DataSource, Repository } from "typeorm";
import Log from "../../entities/log";

export default class LogDAO implements IDAO<Log> {
    private dataSource: DataSource;
    private repository: Repository<Log>;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
        this.repository = this.dataSource.getRepository(Log);
    }

    async create(log: Log): Promise<Log> {
        return await this.repository.save(log);
    }

    async update(log: Log): Promise<Log> {
        const logEncontrado = (await this.list(log, 'buscarPorId'))[0];
        const logAtualizado = this.repository.merge(logEncontrado, log);
        await this.repository.update(log.id, logAtualizado);
        return (await this.list(log, 'buscarPorId'))[0];
    }
    
    async list(log: Log, operacao: string): Promise<Log[]> {
        switch(operacao){
            case 'buscarPorId':
                return this.repository.find({ where: { id: log.id } });
            case 'buscarTodos':
                return this.repository.find();
            default:
                throw new Error('Operação não encontrada');
        }
    }
    
    async delete(log: Log): Promise<void> {
        await this.repository.delete(log.id);
    }
}