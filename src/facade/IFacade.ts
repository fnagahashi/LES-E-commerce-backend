import IStrategy from "../strategy/IStrategy";
import entity from "../entities/entity";

export default interface IFacade<T> {
  create(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(entity: T): Promise<T>;
  findById(entity: string, id: string): Promise<entity>;
  findAll(entity: string): Promise<entity[]>;
  findByFilters(entity: string, filters: Partial<entity>): Promise<entity[]>;
  findBySearch(entity: string, search: string): Promise<entity[]>;
}
