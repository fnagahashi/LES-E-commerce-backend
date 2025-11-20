import IStrategy from "../strategy/IStrategy";

export default interface IFacade<T>{
    create(entity: T, strategies: IStrategy<T>[]): Promise<T>;
    update(entity: T, strategies: IStrategy<T>[]): Promise<T>;
    delete(entity: T): Promise<T>;
    list(entity: T, operation: string): Promise<T[]>;
}