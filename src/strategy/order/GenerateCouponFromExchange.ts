import IStrategy from "../IStrategy";
import Order from "../../entities/order";
import Cupom from "../../entities/cupom";
import { CupomType } from "../../enum/CupomType";
import CupomDAO from "../../DAO/Interface/CupomDAO";

export default class GenerateCouponFromExchangeStrategy implements IStrategy<Order> {
  constructor(private cupomDAO: CupomDAO) {}
  async executar(order: Order): Promise<string | undefined> {
    if (!order.orderItems) return;

    const total = order.orderItems.reduce(
      (acc, item) => acc + Number(item.totalItemValue),
      0
    );

    const newCoupon = new Cupom(
      "TROCA-" + Date.now(),
      total,
      true,
      CupomType.exchange,
      false,
      order.client
    );

    await this.cupomDAO.create(newCoupon);

    (order as any).generateCoupon = newCoupon;

    return;
  }
}