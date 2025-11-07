export interface IDAO<T> {
    salvar(entidade: T): Promise<string>;
    alterar(entidade: T): Promise<number>;
    consultar(entidade: Partial<T>): Promise<T[]>;
    excluir(entidade: T): Promise<string>;
    selecionar(id: string): Promise<T | null>;
    status(id: string, isActive: boolean): Promise<string>;
}