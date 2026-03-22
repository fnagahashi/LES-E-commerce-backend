import AddressDAO from "../DAO/Interface/AddressDAO";
import entity from "../entities/entity";
import IDAO from "../DAO/IDAO";
import IFacade from "./IFacade";
import IStrategy from "../strategy/IStrategy";
import LogDAO from "../DAO/Interface/LogDAO";
import Log from "../entities/log";
import ValidationRequiredGuestFields from "../strategy/client/ValidationRequiredFields";
import ValidationRequiredAddressFields from "../strategy/address/ValidationRequiredFields";
import ClientDAO from "../DAO/Interface/ClientDAO";
import ValidationCEP from "../strategy/address/ValidateCEP";
import ValidateCreditCardFlag from "../strategy/creditCard/ValidateCreditCardFlag";
import ValidationPassword from "../strategy/client/ValidationPassword";
import Client from "../entities/client";
import EncryptPassword from "../strategy/client/EncryptPassword";
import { EncryptionUtil } from "../utils/encryption";
import CreditCardDAO from "../DAO/Interface/CreditCardDAO";

export default class Facade implements IFacade<entity> {
  private readonly entityDAOMap: Map<string, IDAO<entity>>;
  private readonly strategyMap: Map<string, Array<IStrategy<entity>>>;

  private async gerarLog(entity: entity, acao: string): Promise<void> {
    const logDAO = this.entityDAOMap.get("Log") as IDAO<Log>;
    if (logDAO) {
      const mensagem = `${entity.constructor.name} ${acao}: ${JSON.stringify(entity)}`;
      const logEntry = new Log(mensagem);
      await logDAO.create(logEntry);
    }
  }

  constructor(
    private readonly clientDAO: ClientDAO,
    private readonly addressDAO: AddressDAO,
    private readonly creditCardDAO: CreditCardDAO,
    private readonly logDAO: LogDAO,
  ) {
    this.entityDAOMap = new Map<string, IDAO<entity>>();
    this.entityDAOMap.set("Client", this.clientDAO);
    this.entityDAOMap.set("Address", this.addressDAO);
    this.entityDAOMap.set("CreditCard", this.creditCardDAO);
    this.entityDAOMap.set("Log", this.logDAO);
    this.strategyMap = new Map<string, Array<IStrategy<entity>>>();
    this.initializeStrategies();
  }

  private initializeStrategies(): void {
    this.strategyMap.set("ClientCreate", [
      new ValidationRequiredGuestFields(),
      new ValidationPassword(),
      new EncryptPassword(),
    ] as Array<IStrategy<entity>>);

    this.strategyMap.set("ClientUpdate", [
      new ValidationRequiredGuestFields(),
    ] as Array<IStrategy<entity>>);

    this.strategyMap.set("ClientChangePassword", [
      new ValidationPassword(),
      new EncryptPassword(),
    ] as Array<IStrategy<entity>>);

    this.strategyMap.set("Address", [
      new ValidationRequiredAddressFields(),
      new ValidationCEP(),
    ] as Array<IStrategy<entity>>);

    this.strategyMap.set("CreditCard", [new ValidateCreditCardFlag()] as Array<
      IStrategy<entity>
    >);
  }

  public async create(entity: entity): Promise<entity> {
    const entityName = entity.constructor.name;

    const strategies = this.strategyMap.get(`${entityName}Create`) || [];

    let msg: string = "";

    for (const strategy of strategies) {
      const resultado = await strategy.executar(entity);
      if (resultado) {
        msg += resultado + " ";
      }
    }

    if (msg) {
      throw new Error(msg.trim());
    }

    const entidadeDAO = this.entityDAOMap.get(entityName);
    if (!entidadeDAO) {
      throw new Error(`DAO não encontrado para entidade: ${entityName}`);
    }

    const entidadeCriada = await entidadeDAO.create(entity);

    await this.gerarLog(entidadeCriada, "criado");

    return entidadeCriada;
  }

  public async update(entity: entity): Promise<entity> {
    console.log("Iniciando atualização para entidade:", entity);
    const entityName = entity.constructor.name;
    console.log("Nome da entidade para atualização:", entityName);

    const strategies = this.strategyMap.get(`${entityName}Update`) || [];
    console.log(
      `Estratégias encontradas para ${entityName}Update:`,
      strategies,
    );

    let msg: string = "";

    for (const strategy of strategies) {
      const resultado = await strategy.executar(entity);
      if (resultado) {
        msg += resultado + " ";
      }
    }

    if (msg) {
      throw new Error(msg.trim());
    }

    const entidadeDAO = this.entityDAOMap.get(entityName);
    console.log("DAO encontrado para atualização:", entidadeDAO);
    if (!entidadeDAO) {
      throw new Error(`DAO não encontrado para entidade: ${entityName}`);
    }
    if (entityName === "Client") {
      const clientDAO = this.clientDAO;
      const addressDAO = this.addressDAO;
      const creditCardDAO = this.creditCardDAO;

      const client = (await clientDAO.findById(entity.id)) as Client;

      if (!client) {
        throw new Error("Cliente não encontrado");
      }

      if (entity.addresses) {
        const existing = client.addresses || [];

        const updated = entity.addresses.map((addr: any) => {
          if (addr.id) {
            const found = existing.find((a) => a.id === addr.id);
            if (found) {
              Object.assign(found, addr);
              return found;
            }
          }
          return addr;
        });

        const incomingIds = entity.addresses
          .filter((a: any) => a.id)
          .map((a: any) => a.id);

        const toRemove = existing.filter((a) => !incomingIds.includes(a.id));

        if (toRemove.length > 0) {
          for (const addr of toRemove) {
            await addressDAO.delete(addr);
          }
        }

        client.addresses = updated;
      }

      if (entity.creditCard) {
        const existing = client.creditCard || [];

        const updated = entity.creditCard.map((card: any) => {
          if (card.id) {
            const found = existing.find((c) => c.id === card.id);
            if (found) {
              Object.assign(found, card);
              return found;
            }
          }
          return card;
        });

        const incomingIds = entity.creditCard
          .filter((c: any) => c.id)
          .map((c: any) => c.id);

        const toRemove = existing.filter((c) => !incomingIds.includes(c.id));

        for (const card of toRemove) {
          await creditCardDAO.delete(card);
        }

        client.creditCard = updated;
      }

      Object.assign(client, entity);

      const updatedClient = await clientDAO.update(client);

      await this.gerarLog(updatedClient, "atualizado");

      return updatedClient;
    }

    const entidadeAtualizada = await entidadeDAO.update(entity);
    console.log("Entidade atualizada com sucesso:", entidadeAtualizada);
    await this.gerarLog(entidadeAtualizada, "atualizado");

    return entidadeAtualizada;
  }

  public async changePassword(
    clientId: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<entity> {
    const clientDAO = this.entityDAOMap.get("Client") as IDAO<entity>;

    if (!clientDAO) {
      throw new Error("DAO não encontrado para Client");
    }

    const client = (await clientDAO.findById(clientId)) as Client;

    if (!client) {
      throw new Error("Cliente não encontrado");
    }
    const validatePassword = await EncryptionUtil.comparar(
      currentPassword,
      client.password,
    );
    if (validatePassword === false) {
      throw new Error("Senha atual incorreta");
    }

    client.password = newPassword;

    const strategies = this.strategyMap.get("ClientChangePassword") || [];

    let msg = "";

    for (const strategy of strategies) {
      const result = await strategy.executar(client);

      if (result) {
        msg += result + " ";
      }
    }

    if (msg) {
      throw new Error(msg.trim());
    }

    const updatedClient = await clientDAO.update(client);

    await this.gerarLog(updatedClient, "senha alterada");

    return updatedClient;
  }

  public async delete(entity: entity): Promise<entity> {
    const entityName = entity.constructor.name;
    const entidadeDAO = this.entityDAOMap.get(entityName);

    if (!entidadeDAO) {
      throw new Error(`DAO não encontrado para entidade: ${entityName}`);
    }

    const entidadeParaDeletar = { ...entity };

    await entidadeDAO.delete(entity);
    await this.gerarLog(entidadeParaDeletar, "deletado");

    return entidadeParaDeletar;
  }

  public async findAll(entityName: string): Promise<entity[]> {
    const entidadeDAO = this.entityDAOMap.get(entityName);

    if (!entidadeDAO) {
      throw new Error(`DAO não encontrado para entidade: ${entityName}`);
    }

    let entidades;

    if (entityName === "Client") {
      entidades = await (entidadeDAO as any).findByRole("CLIENT");
    } else {
      entidades = await entidadeDAO.findAll();
    }

    if (entidades.length > 0) {
      await this.gerarLog(entidades[0], "listado");
    }

    return entidades;
  }

  public async findById(
    entityName: string,
    id: string,
  ): Promise<entity | null> {
    const entidadeDAO = this.entityDAOMap.get(entityName);

    if (!entidadeDAO) {
      throw new Error(`DAO não encontrado para entidade: ${entityName}`);
    }

    const entidade = await entidadeDAO.findById(id);

    if (entidade) {
      await this.gerarLog(entidade, "consultado por ID");
    }

    return entidade;
  }

  public async findByFilters(
    entityName: string,
    filters: Partial<entity>,
  ): Promise<entity[]> {
    const entidadeDAO = this.entityDAOMap.get(entityName);

    if (!entidadeDAO) {
      throw new Error(`DAO não encontrado para entidade: ${entityName}`);
    }

    const entidades = await entidadeDAO.findByFilters(filters);

    return entidades;
  }
  public async findBySearch(
    entityName: string,
    search: string,
  ): Promise<entity[]> {
    const entidadeDAO = this.entityDAOMap.get(entityName);

    if (!entidadeDAO) {
      throw new Error(`DAO não encontrado para entidade: ${entityName}`);
    }

    if (!entidadeDAO.findBySearch) {
      throw new Error(`Busca não suportada para entidade: ${entityName}`);
    }

    return await entidadeDAO.findBySearch(search);
  }
}
