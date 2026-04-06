import { Request, Response } from "express";
import Facade from "../facade/Facade";

export class BooksController {
  constructor(private readonly facade: Facade) {}

  create(req: Request, res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }

  login(req: Request, res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }

  find(req: Request, res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }

  findById(req: Request, res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      console.log("facade:", this.facade);
      const books = await this.facade.findAll("Book");
      console.log(`📋 Listando produtos: ${books.length} encontrados`);

      res.json({
        success: true,
        count: books.length,
        books,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
}
