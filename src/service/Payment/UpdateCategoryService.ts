import { getCustomRepository } from "typeorm";
import { ICategoryRequest } from "../../DAO/Interface/PaymentDAO";
import { CategoryRepositories } from "../../repository/PaymentRepositories";


class UpdateCategoryService {
    async execute ({id, name}: ICategoryRequest){
        if (!name) {
            throw new Error ("Nome Obrigatório");
        }
        const categoryRepository = getCustomRepository(CategoryRepositories);
        const category = await categoryRepository.findOne(id);

        if (!category) {
            throw new Error ("Categoria não encontrada");
        }

        if (name){
            category.name = name;
        }

        await categoryRepository.update(id || 0, category);

        return category;
    }
}
export {UpdateCategoryService};