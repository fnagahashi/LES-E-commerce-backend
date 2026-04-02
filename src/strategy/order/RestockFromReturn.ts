import IStrategy from "../IStrategy";
import Order from "../../entities/order";
import StockDAO from "../../DAO/Interface/StockDAO";

export default class RestockFromReturnStrategy implements IStrategy<Order> {
  constructor(private stockDAO: StockDAO) {}

  async executar(order: Order): Promise<string | undefined> {
    if (!order.orderItems) return;

    for (const item of order.orderItems) {
      const stock = await this.stockDAO.findById(item.book.id);

      if (stock) {
        stock.quantity += item.quantity;
        await this.stockDAO.update(stock);
      }
    }

    return;
  }
}