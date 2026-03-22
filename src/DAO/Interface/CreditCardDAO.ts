import { DataSource, Repository } from "typeorm";
import IDAO from "../IDAO";
import CreditCard from "../../entities/creditCard";

export default class CreditCardDAO implements IDAO<CreditCard> {
  private repository: Repository<CreditCard>;

  constructor(connection: DataSource) {
    this.repository = connection.getRepository(CreditCard);
  }

  async create(creditCard: CreditCard): Promise<CreditCard> {
    return await this.repository.save(creditCard);
  }

  async delete(creditCard: CreditCard): Promise<void> {
    await this.repository.remove(creditCard);
  }

  async update(creditCard: CreditCard): Promise<CreditCard> {
    const creditCardExists = await this.findById(creditCard.id);
    if (!creditCardExists) {
      throw new Error("Cartão de crédito não encontrado");
    }
    const updatedCreditCard = this.repository.merge(
      creditCardExists[0],
      creditCard,
    );
    return await this.repository.save(updatedCreditCard);
  }
  async findAll(): Promise<CreditCard[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<CreditCard | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findByFilters(filters: Partial<CreditCard>): Promise<CreditCard[]> {
    return this.repository.find();
  }
  async findBySearch(search: string): Promise<CreditCard[]> {
    return this.repository.find();
  }
}
