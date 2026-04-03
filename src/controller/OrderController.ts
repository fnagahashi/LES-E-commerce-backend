import { Request, Response } from "express";
import Facade from "../facade/Facade";
import Order from "../entities/order";
import entity from "../entities/entity";
import { OrderStatus } from "../enum/OrderStatus";
import OrderItem from "../entities/orderItem";
import Payment from "../entities/payment";
import Delivery from "../entities/delivery";

export class OrderController {
  constructor(private readonly facade: Facade) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const {
        clientId,
        orderItems = [],
        payments = [],
        deliveryId,
        orderDate,
        totalPrice,
        freightValue,
        status = OrderStatus.inProcessing,
      } = req.body;
      console.log("Criando pedido: ", req.body);
      console.log("Para qual cliente é esse pedido: ", clientId.name);

      const items = orderItems.map(
        (item: OrderItem) =>
          new OrderItem(
            item.order,
            item.book,
            item.quantity,
            item.unitaryValue,
            item.totalItemValue,
          ),
      );

      const paymentsOrder = payments.map(
        (payment: Payment) =>
          new Payment(
            payment.order,
            payment.creditCard!,
            payment.cupom!,
            payment.paymentMethod,
            payment.paymentValue,
            payment.paymentStatus,
          ),
      );

      const order = new Order(
        clientId,
        items,
        paymentsOrder,
        deliveryId,
        orderDate,
        totalPrice,
        freightValue,
        status,
      );

      const orderCreated = await this.facade.create(order);

      res.status(201).json({
        success: true,
        message: "Pedido realizado com sucesso",
        order: orderCreated,
      });
    } catch (error: any) {
      console.error("❌ Erro ao criar Pedido:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async approveOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const order = await this.facade.findById("Order", id);

      if (!order) {
        res.status(404).json({ error: "Pedido nao encontrado" });
        return;
      }

      const result = await this.facade.approveOrder(order as Order);

      res.status(200).json({
        success: true,
        message: "Pedido aprovado com sucesso!",
        order: result,
      });
    } catch (error: any) {
      console.error("❌ Erro ao aprovar Pedido:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async reproveOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await this.facade.findById("Order", id);

      if (!order) {
        res.status(404).json({ error: "Pedido nao encontrado" });
        return;
      }

      const result = await this.facade.reproveOrder(order as Order);

      res.status(200).json({
        success: true,
        message: "Pedido reprovado com sucesso!",
        order: result,
      });
    } catch (error: any) {
      console.error("❌ Erro ao reprovar Pedido:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async shipOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await this.facade.findById("Order", id);

      if (!order) {
        res.status(404).json({ error: "Pedido nao encontrado" });
        return;
      }

      const result = await this.facade.shipOrder(order as Order);

      res.status(200).json({
        success: true,
        message: "Pedido enviado com sucesso!",
        order: result,
      });
    } catch (error: any) {
      console.error("❌ Erro ao enviar Pedido:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async confirmDelivery (req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await this.facade.findById("Order", id);

      if (!order) {
        res.status(404).json({ error: "Pedido nao encontrado" });
        return;
      }

      const result = await this.facade.deliverOrder(order as Order);

      res.status(200).json(result);
    } catch (error: any) {
      console.error("❌ Erro ao confirmar entrega do Pedido:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async requestExchange(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await this.facade.findById("Order", id);

      if (!order) {
        res.status(404).json({ error: "Pedido nao encontrado" });
      }

      const result = await this.facade.requestExchange(order as Order);

      res.status(200).json(result);
    } catch (error: any) {
      console.error("❌ Erro ao solicitar troca do Pedido:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async authorizeExchange (req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await this.facade.findById("Order", id);

      if (!order) {
        res.status(404).json({ error: "Pedido nao encontrado" });
      }

      const result = await this.facade.authorizeExchange(order as Order);

      res.status(200).json(result);
    } catch (error: any) {
      console.error("❌ Erro ao autorizar troca do Pedido:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async confirmExchange (req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await this.facade.findById("Order", id);

      if (!order) {
        res.status(404).json({ error: "Pedido nao encontrado" });
      }

      const result = await this.facade.confirmReturn(order as Order);

      res.status(200).json(result);
    } catch (error: any) {
      console.error("❌ Erro ao confirmar troca do Pedido:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const order = await this.facade.findById("Order", id);

      if (!order) {
        res.status(404).json({ error: "Pedido nao encontrado" });
      }

      res.status(200).json(order);
    } catch (error: any) {
      console.error("❌ Erro ao listar Pedido:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const orders = await this.facade.findAll("Order");

      res.status(200).json(orders);
    } catch (error: any) {
      console.error("❌ Erro ao listar todos os pedidos:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
}
