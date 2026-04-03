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
import OrderDAO from "../DAO/Interface/OrderDAO";
import PaymentDAO from "../DAO/Interface/PaymentDAO";
import ValidationOrderRequiredFields from "../strategy/order/ValidationOrderRequiredFields";
import StockDAO from "../DAO/Interface/StockDAO";
import ValidationStock from "../strategy/order/ValidationStock";
import ValidationRequiredFields from "../strategy/payment/ValidationRequiredFields";
import CalculatedTotalOrder from "../strategy/payment/CalculatedTotalOrder";
import ValidationTotalValue from "../strategy/payment/ValidationTotalValue";
import ValidationCreditCard from "../strategy/payment/ValidationCreditCard";
import ValidationCupom from "../strategy/payment/ValidationCupom";
import ValidationPaymentExcess from "../strategy/payment/ValidationPaymentExcess";
import ValidateMinValuePerCardStrategy from "../strategy/payment/ValidateMinValuePerCard";
import ValidateCouponAndCardCombinationStrategy from "../strategy/payment/ValidateCouponAndCardCombination";
import ProcessPaymentStatusStrategy from "../strategy/payment/ProcessPaymentStatus";
import DecreaseStockStrategy from "../strategy/order/DecreaseStock";
import ValidateExchangeRequestStrategy from "../strategy/order/ValidateExchangeRequest";
import RequestExchangeStrategy from "../strategy/order/RequestExchange";
import AuthorizeExchangeStrategy from "../strategy/order/AuthorizeExchange";
import RestockFromReturnStrategy from "../strategy/order/RestockFromReturn";
import GenerateCouponFromExchangeStrategy from "../strategy/order/GenerateCouponFromExchange";
import ConfirmReturnStrategy from "../strategy/order/ConfirmExchange";
import SetOrderInProcessingStrategy from "../strategy/order/SetOrderInProcessing";
import ApproveOrderStrategy from "../strategy/order/ApprovedOrder";
import ShipOrderStrategy from "../strategy/order/ShipOrder";
import DeliverOrderStrategy from "../strategy/order/ConfirmDelivery";
import ValidateCouponUsageStrategy from "../strategy/payment/ValidateCouponUsage";
import MarkCouponAsUsedStrategy from "../strategy/payment/MarkUsedCoupon";
import CupomDAO from "../DAO/Interface/CupomDAO";
import ReprovedOrderStrategy from "../strategy/order/ReprovedOrder";

export default class Facade implements IFacade<entity> {
  private readonly entityDAOMap: Map<string, IDAO<entity>>;
  private readonly strategyMap: Map<string, Array<IStrategy<entity>>>;
  cupomDAO!: CupomDAO;

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
    private readonly orderDAO: OrderDAO,
    private readonly stockDAO: StockDAO,
    private readonly logDAO: LogDAO,
  ) {
    this.entityDAOMap = new Map<string, IDAO<entity>>();
    this.entityDAOMap.set("Client", this.clientDAO);
    this.entityDAOMap.set("Address", this.addressDAO);
    this.entityDAOMap.set("CreditCard", this.creditCardDAO);
    this.entityDAOMap.set("Order", this.orderDAO);
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

    this.strategyMap.set("OrderCreate", [
      new ValidationOrderRequiredFields(),
      new ValidationStock(this.stockDAO),
      new CalculatedTotalOrder(),
      new ValidateMinValuePerCardStrategy(),
      new ValidateCouponAndCardCombinationStrategy(),
      new ValidateCouponUsageStrategy(),
      new ProcessPaymentStatusStrategy(),
      new SetOrderInProcessingStrategy(),
    ] as Array<IStrategy<entity>>);

    this.strategyMap.set("OrderApproved", [
      new ApproveOrderStrategy(),
      new DecreaseStockStrategy(this.stockDAO),
      new MarkCouponAsUsedStrategy(this.cupomDAO),
    ]);

    this.strategyMap.set("OrderReproved", [
      new ReprovedOrderStrategy(),
    ]);

    this.strategyMap.set("OrderShip", [
      new ShipOrderStrategy(),
    ]);

    this.strategyMap.set("OrderDeliver", [
      new DeliverOrderStrategy(),
    ])

    this.strategyMap.set("OrderRequestExchange", [
      new ValidateExchangeRequestStrategy(),
      new RequestExchangeStrategy(),
    ] as Array<IStrategy<entity>>);

    this.strategyMap.set("OrderAuthorizeExchange", [
      new AuthorizeExchangeStrategy(),
    ]);

    this.strategyMap.set("OrderConfirmReturn", [
      new ConfirmReturnStrategy(),
      new RestockFromReturnStrategy(this.stockDAO),
      new GenerateCouponFromExchangeStrategy(this.cupomDAO),
    ]);

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
      const clientEntity = entity as Client;
      const clientDAO = this.clientDAO;
      const addressDAO = this.addressDAO;
      const creditCardDAO = this.creditCardDAO;

      const client = (await clientDAO.findById(entity.id)) as Client;

      if (!client) {
        throw new Error("Cliente não encontrado");
      }

      if (clientEntity.addresses) {
        const existing = client.addresses || [];

        clientEntity.addresses = clientEntity.addresses.map((addr: any) => {
          if (!addr.id || addr.id === "") {
            delete addr.id;
          }
          return addr;
        });

        const updated = clientEntity.addresses.map((addr: any) => {
          if (addr.id) {
            const found = existing.find((a) => a.id === addr.id);
            if (found) {
              Object.assign(found, addr);
              return found;
            }
          }
          return addr;
        });

        const incomingIds = clientEntity.addresses
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

      if (clientEntity.creditCard) {
        const existing = client.creditCard || [];

        const updated = clientEntity.creditCard.map((card: any) => {
          if (card.id) {
            const found = existing.find((c) => c.id === card.id);
            if (found) {
              Object.assign(found, card);
              return found;
            }
          }
          return card;
        });

        const incomingIds = clientEntity.creditCard
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

  public async getCuponsByClient(clientId: string) {
    await this.cupomDAO.findByClient(clientId);
    return [];
  }

  private async executeStrategies(key: string, entity: entity): Promise<void> {
    const strategies = this.strategyMap.get(key) || [];

    let msg = "";

    for (const strategy of strategies) {
      const result = await strategy.executar(entity);

      if (result) {
        msg += result + " ";
      }
    }

    if (msg) {
      throw new Error(msg.trim());
    }
  }

  public async approveOrder(order: entity): Promise<entity> {
    const entityName = order.constructor.name;

    if (entityName !== "Order") {
      throw new Error("Operação válida apenas para pedidos");
    }
    await this.executeStrategies("OrderApprove", order);

    const orderDAO = this.entityDAOMap.get("Order");

    if (!orderDAO) {
      throw new Error("DAO não encontrado");
    }

    const updated = await orderDAO.update(order);

    await this.gerarLog(updated, "pedido aprovado");

    return updated;
  }

  public async reproveOrder(order: entity): Promise<entity> {
    const entityName = order.constructor.name;

    if (entityName !== "Order") {
      throw new Error("Operação válida apenas para pedidos");
    }
    await this.executeStrategies("OrderReproved", order);

    const orderDAO = this.entityDAOMap.get("Order");

    if (!orderDAO) {
      throw new Error("DAO não encontrado");
    }

    const updated = await orderDAO.update(order);

    await this.gerarLog(updated, "pedido reprovado");

    return updated;
  }

  public async shipOrder(order: entity): Promise<entity> {
    const entityName = order.constructor.name;

    if (entityName !== "Order") {
      throw new Error("Operação válida apenas para pedidos");
    }

    await this.executeStrategies("OrderShip", order);

    const dao = this.entityDAOMap.get("Order");

    if (!dao) throw new Error("DAO não encontrado");

    const updated = await dao.update(order);

    await this.gerarLog(updated, "pedido enviado");

    return updated;
  }

  public async deliverOrder(order: entity): Promise<entity> {
    const entityName = order.constructor.name;

    if (entityName !== "Order") {
      throw new Error("Operação válida apenas para pedidos");
    }
    await this.executeStrategies("OrderDeliver", order);

    const dao = this.entityDAOMap.get("Order");

    if (!dao) throw new Error("DAO não encontrado");

    const updated = await dao.update(order);

    await this.gerarLog(updated, "pedido entregue");

    return updated;
  }

  public async requestExchange(order: entity): Promise<entity> {
    const entityName = order.constructor.name;

    if (entityName !== "Order") {
      throw new Error("Operação válida apenas para pedidos");
    }

    await this.executeStrategies("OrderRequestExchange", order);

    const orderDAO = this.entityDAOMap.get("Order");

    if (!orderDAO) {
      throw new Error("DAO não encontrado para Order");
    }

    const updatedOrder = await orderDAO.update(order);
    await this.gerarLog(updatedOrder, "Solicitou Troca");

    return updatedOrder;
  }

  public async authorizeExchange(order: entity): Promise<entity> {
    const entityName = order.constructor.name;

    if (entityName !== "Order") {
      throw new Error("Operação válida apenas para pedidos");
    }

    await this.executeStrategies("OrderAuthorizeExchange", order);
    const orderDAO = this.entityDAOMap.get("Order");

    if (!orderDAO) {
      throw new Error("DAO não encontrado para Order");
    }

    const updatedOrder = await orderDAO.update(order);

    await this.gerarLog(updatedOrder, "Autorizou Troca");

    return updatedOrder;
  }

  public async confirmReturn(order: entity): Promise<entity> {
    const entityName = order.constructor.name;

    if (entityName !== "Order") {
      throw new Error("Operação válida apenas para pedidos");
    }

    await this.executeStrategies("OrderConfirmReturn", order);

    const orderDAO = this.entityDAOMap.get("Order");

    if (!orderDAO) {
      throw new Error("DAO não encontrado para Order");
    }

    const updatedOrder = await orderDAO.update(order);

    await this.gerarLog(updatedOrder, "confirmou retorno de troca");

    return updatedOrder;
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
