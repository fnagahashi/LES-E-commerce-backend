import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import entity from "./entity";
import Order from "./order";
import CreditCard from "./creditCard";

@Entity("payment")
export default class Payment extends entity {
    @OneToOne(() => Order) 
    @JoinColumn({ name: "orderId" })
      order: Order;

    @OneToMany(() => CreditCard, (creditCard) => creditCard.payment)
    creditCard: CreditCard[];

    @Column()
    paymentValue: string

    @Column
}