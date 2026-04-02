import IStrategy from "../IStrategy";
import Order from "../../entities/order";
import Cupom from "../../entities/cupom";
import { CupomType } from "../../enum/CupomType";

export default class GenerateCouponFromExchangeStrategy implements IStrategy<Order> {
  async executar(order: Order): Promise<string | undefined> {
    if (!order.orderItems) return;

    const total = order.orderItems.reduce(
      (acc, item) => acc + Number(item.totalItemValue),
      0
    );

    const newCoupon = new Cupom(
      "TROCA-" + Date.now(),
      total.toString(),
      true,
      CupomType.exchange
    );

    console.log("Cupom de troca gerado:", newCoupon);

    return;
  }
}