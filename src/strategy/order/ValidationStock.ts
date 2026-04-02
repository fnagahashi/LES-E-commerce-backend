import IStrategy from "../IStrategy";
import Order from "../../entities/order";
import StockDAO from "../../DAO/Interface/StockDAO";

export default class ValidationStock implements IStrategy<Order> {
  constructor(private stockDAO: StockDAO) {}
  async executar(order: Order): Promise<string | undefined> {
    const errors: string[] = [];

    for (const orderItem of order.orderItems) {
      const stock = await this.stockDAO.findByFilters({
        book: orderItem.book,
      });

      if (!stock || stock.length === 0) {
        errors.push(`Produto ${orderItem.book.title} sem estoque`);
      }

      if (stock[0].quantity < orderItem.quantity) {
        errors.push(
          `Estoque insuficiente para o produto ${orderItem.book.title}`,
        );
      }
    }
    return errors.length > 0 ? errors.join(", ") : undefined;
  }
}
