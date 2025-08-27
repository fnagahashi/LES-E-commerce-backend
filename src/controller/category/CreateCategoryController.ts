import { Request, Response } from "express";
import { CreateCategoryService } from "../../service/Category/CreateCategoryService";

class CreateCategoryController {
  async handle(request: Request, response: Response) {
    const { name } = request.body;
    const createCategoryService = new CreateCategoryService();
   const category = await createCategoryService.execute(
   {
      name
    }); 
    response.json(category);
  }
}
export { CreateCategoryController };