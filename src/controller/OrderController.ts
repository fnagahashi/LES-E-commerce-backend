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
}
