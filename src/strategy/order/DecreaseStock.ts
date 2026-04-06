import IStrategy from "../IStrategy";
import Order from "../../entities/order";
import StockDAO from "../../DAO/Interface/StockDAO";
import { OrderStatus } from "../../enum/OrderStatus";

export default class DecreaseStockStrategy implements IStrategy<Order> {
  constructor(private stockDAO: StockDAO) {}

  async executar(order: Order): Promise<string | undefined> {
    console.log("Diminuir estoque");
    if (!order.orderItems) return;
    if (order.status !== OrderStatus.approved) return;

    for (const item of order.orderItems) {
      console.log("item", item);
      const stock = await this.stockDAO.findById(item.book.stock.id);
      console.log("item.book.id", item.book.id);
      console.log("stock", stock);

      if (!stock || item.book.stock.quantity < item.quantity) {
        console.log(
          "stock quantidade para o livro: ",
          item.book.id,
          stock?.book.stock.quantity,
        );
        return `Estoque insuficiente para o livro ${item.book.id}`;
      }

      stock.quantity -= item.quantity;

      await this.stockDAO.update(stock);
    }

    return;
  }
}
