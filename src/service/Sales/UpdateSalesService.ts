import { getCustomRepository } from "typeorm";
import { ISalesRequest } from "../../DAO/Interface/ReservationDAO";
import { SalesRepositories } from "../../repository/SalesRepositories";


class UpdateSalesService {
    async execute ({id, date, qtd, price, product, client, total}: ISalesRequest){
        if (!product) {
            throw new Error ("Deve haver produto");
        }
        const productRepository = getCustomRepository(SalesRepositories);
        const sales = await productRepository.findOne(id);

        if (!sales) {
            throw new Error ("Venda não encontrada");
        }
        if (date) {
            sales.date = date;
        }
        if (qtd) {
            sales.qtd = qtd;
        }
        if (price) {
            sales.price = price;
        }
        if (client) {
            sales.client = client;
        }
        if (total) {
            sales.total = total;
        }
        if (product) {
            sales.product = product;
        }
       await productRepository.update(id || 0, sales);
        return sales;

    }
    
}
export {UpdateSalesService};