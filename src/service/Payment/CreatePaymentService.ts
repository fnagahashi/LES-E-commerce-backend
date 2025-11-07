import { IPaymentRequest } from "../../DAO/Interface/PaymentDAO";
import { PaymentRepositories } from "../../repository/PaymentRepositories";
import { getCustomRepository } from "typeorm";

class CreatePaymentService {
    async execute ({valor, formaPagamento, isPaid}: IPaymentRequest){
        if (!valor) {
            throw new Error ("Valor Obrigatório");
        }

        const paymentRepository = getCustomRepository(PaymentRepositories);
        const paymentAlreadyExists = await paymentRepository.findOne({ isPaid: true });

        if (paymentAlreadyExists) {
            throw new Error("Pagamento já realizado");
        }
       const payment = paymentRepository.create({ valor, formaPagamento, isPaid }); 
       await paymentRepository.save(payment);
        return payment;
    }
}
export {CreatePaymentService};