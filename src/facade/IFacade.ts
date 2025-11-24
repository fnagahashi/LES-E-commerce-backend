import IStrategy from "../strategy/IStrategy";
import entity from "../entities/entity";

export default interface IFacade<T>{
    create(entity: T): Promise<T>;
    update(entity: T): Promise<T>;
    delete(entity: T): Promise<T>;
    list(entity: T, operation: string): Promise<T[]>;
}