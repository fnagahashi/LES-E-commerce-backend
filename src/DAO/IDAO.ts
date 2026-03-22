export default interface IDAO<entity> {
  create(Entity: entity): Promise<entity>;
  update(Entity: entity): Promise<entity>;
  delete(Entity: entity): Promise<void>;
  findById(id: string): Promise<entity>;
  findAll(): Promise<entity[]>;
  findByFilters(filters: Partial<entity>): Promise<entity[]>;
  findBySearch(search: string): Promise<entity[]>;
}
