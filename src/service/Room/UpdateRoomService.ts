import { getCustomRepository } from "typeorm";
import { IProductRequest } from "../../DAO/Interface/IProductInterface";
import { ProductRepositories } from "../../repository/RoomRepositories";

class UpdateProductService {
    async execute ({id, name, category, desc, price}: IProductRequest){
        if (!name) {
            throw new Error ("Nome obrigatorio");
        }
        const productRepository = getCustomRepository(ProductRepositories);
        const product = await productRepository.findOne(id);
        
        if (!product) {
            throw new Error ("Produto não encontrado");
        }
        if (name) {
            product.name = name;
        }
        if (category) {
            product.category = category;
        }
        if (desc) {
            product.desc = desc;
        }
        if (price) {
            product.price = price;
        }
        
        await productRepository.update(id, product);
        
        return product;
    }
}
export {UpdateProductService};