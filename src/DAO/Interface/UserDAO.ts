import { DataSource, Repository } from "typeorm";
import IDAO from "../IDAO";
import User from "../../entities/User";

export default class UserDAO implements IDAO<User> {
    private dataSource: DataSource;
    private repository: Repository<User>;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
        this.repository = this.dataSource.getRepository(User);
    }

    public async salvar(entidade: User): Promise<User> {
        return await this.repository.save(entidade);
    }

    public async listar(): Promise<User[]> {
        return await this.repository.find();
    }

    public async atualizar(entidade: User): Promise<User> {
        const usuario = await this.buscar(entidade, 'buscarPorId');
        
        const usuarioAtualizado = this.repository.merge(usuario[0], entidade);
        
        console.log(usuarioAtualizado)
        return await this.repository.save(usuarioAtualizado);
    }

    public async buscar(usuario: User, operacao: string): Promise<User[]> {
        switch(operacao){
            case 'buscarPorId':
                return this.repository.find({
                    where: { id: usuario.id }
                });   
            case 'buscarTodos':
                return this.repository.find({
                    where: {
                        isActive: false,
                    }
                });
            case 'buscarPorEmail':
                return this.repository.find({
                    where: {
                        isActive: false,
                        email: usuario.email
                    }
                });
            case 'buscarAdmin':
                return this.repository.find({
                    where: {
                        tipoUsuario: TipoUsuario.ADMIN
                    }
                });
            default:
                throw new Error('Operação não encontrada');
        }
    }

    public async deletar(entidade: Usuario): Promise<void> {
        await this.repository.delete(entidade.id);
    }
}