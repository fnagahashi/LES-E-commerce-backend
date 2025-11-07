export default interface IDAO<entity> {
    create(Entity:entity): Promise<entity>;
    update(Entity:entity): Promise<entity>;
    delete(Entity:entity): Promise<void>;
    list(Entity:entity, operation: string): Promise<entity[]>;
}