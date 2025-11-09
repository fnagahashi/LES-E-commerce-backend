export default interface IStrategy<T> {
    executar(entity: T):Promise<string| undefined>;
}