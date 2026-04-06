import { Request, Response } from "express";
import Facade from "../facade/Facade";
import Order from "../entities/order";
import { OrderStatus } from "../enum/OrderStatus";
import OrderItem from "../entities/orderItem";
import Payment from "../entities/payment";
import Cupom from "../entities/cupom";
import Book from "../entities/book";

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

      const items = await Promise.all(
        orderItems.map(async (item: any) => {
          console.log("item: ", item.bookId);
          const book = (await this.facade.findById(
            "Book",
            item.bookId,
          )) as Book;

          if (!book) throw new Error("Livro não encontrado");

          return new OrderItem(
            item.order,
            { id: item.bookId } as Book,
            item.quantity,
            item.unitaryValue,
            item.totalItemValue,
          );
        }),
      );
      const paymentsOrder = await Promise.all(
        payments.map(async (payment: any) => {
          let cupom: Cupom | null = null;

          if (payment.cupomCode) {
            cupom =
              (await this.facade.getCupomByCode(payment.cupomCode)) ?? null;

            if (!cupom) {
              throw new Error(`Cupom ${payment.cupomCode} não encontrado`);
            }
          }

          return new Payment(
            payment.order,
            payment.creditCard ?? null,
            cupom ?? null,
            payment.paymentMethod,
            payment.paymentValue,
            payment.paymentStatus,
          );
        }),
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

  async confirmDelivery(req: Request, res: Response) {
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

  async authorizeExchange(req: Request, res: Response) {
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

  async confirmExchange(req: Request, res: Response) {
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
      const user = req.user;

      const order = (await this.facade.findById("Order", id)) as Order;

      if (!order) {
        res.status(404).json({ error: "Pedido nao encontrado" });
      }

      if (user?.email !== order.client.email) {
        res.status(403).json({ error: "Acesso negado" });
        return;
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
      const user = req.user;

      if (user?.role !== "ADMIN") {
        res.status(403).json({ error: "Acesso negado" });
        return;
      }

      res.status(200).json(orders);
    } catch (error: any) {
      console.error("❌ Erro ao listar todos os pedidos:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getOrdersByClient(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const orders = await this.facade.getOrdersByClient(id);

      res.status(200).json(orders);
    } catch (error: any) {
      console.error("❌ Erro ao listar os pedidos do cliente:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
}
