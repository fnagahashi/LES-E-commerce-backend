import IDAO from "../IDAO";
import { DataSource, Repository } from "typeorm";
import Sale from "../../entities/sale";

export default class SaleDAO implements IDAO<Sale> {
  private repository: Repository<Sale>;

  constructor(connection: DataSource) {
    this.repository = connection.getRepository(Sale);
  }

  async create(sale: Sale): Promise<Sale> {
    return await this.repository.save(sale);
  }

  async update(sale: Sale): Promise<Sale> {
    const saleExistente = await this.repository.findOne({
      where: { id: sale.id },
    });
    if (!saleExistente) {
      throw new Error("Promoção não encontrada");
    }

    const saleAtualizado = this.repository.merge(saleExistente, sale);
    return await this.repository.save(saleAtualizado);
  }

  async list(sale: Sale, operacao: string): Promise<Sale[]> {
    switch (operacao) {
      case "findById":
        return await this.repository.find({ where: { id: sale.id } });

      case "findByCode":
        return await this.repository.find({
          where: {
            codigoSale: sale.codigoSale,
          },
        });

      case "findByFilters":
        return await this.repository.find({
          where: {
            isActive: true,
            validoAte: new Date(),
          },
        });

      case "findAll":
        return await this.repository.find();

      default:
        throw new Error("Operação não encontrada no SaleDAO");
    }
  }

  async delete(sale: Sale): Promise<void> {
    await this.repository.softDelete(sale.id);
  }

  async buscarPorCodigoAtivo(codigo: string): Promise<Sale | null> {
    return await this.repository.findOne({
      where: {
        codigoSale: codigo,
        isActive: true,
        validoAte: new Date(),
      },
    });
  }

  async desativarPromocao(id: string): Promise<Sale> {
    const sale = await this.repository.findOne({ where: { id } });
    if (!sale) {
      throw new Error("Promoção não encontrada");
    }

    sale.isActive = false;
    return await this.repository.save(sale);
  }

  async listarPromocoesAtivas(): Promise<Sale[]> {
    return await this.repository.find({
      where: {
        isActive: true,
        validoAte: new Date(),
      },
      order: {
        validoAte: "ASC",
      },
    });
  }
}
