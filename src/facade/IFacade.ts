import IStrategy from "../strategy/IStrategy";

export default interface IFacade<T>{
    create(entity: T, strategies: IStrategy<T>[]): Promise<string | undefined>;
    update(entity: T, strategies: IStrategy<T>[]): Promise<string | undefined>;
    delete(entity: T): Promise<string | undefined>;
    list(entity: T, operation: string): Promise<T[] | string | undefined>;
}