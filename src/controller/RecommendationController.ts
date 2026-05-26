import { Request, Response } from "express";
import Facade from "../facade/Facade";
import ChatRecommendation from "../entities/chatRecommendation";
import Client from "../entities/client";

export class RecommendationController {
  constructor(private readonly facade: Facade) {}

  async recommend(req: Request, res: Response): Promise<void> {
    try {
      const { message } = req.body;

      const user = req.user;

      if (!message) {
        res.status(400).json({
          success: false,
          error: "Mensagem é obrigatória",
        });
        return;
      }

      if (!user?.email) {
        res.status(401).json({
          success: false,
          error: "Usuário não autenticado",
        });
        return;
      }

      const clients = await this.facade.findByFilters("Client", {
        email: user.email,
      } as any);

      const client = clients[0] as Client;

      if (!client) {
        res.status(404).json({
          success: false,
          error: "Cliente não encontrado",
        });
        return;
      }

      const recommendation = new ChatRecommendation(client, message);

      const result = await this.facade.recommendProducts(recommendation);

      if (!result.recommendedBooks || result.recommendedBooks.length === 0) {
        res.status(200).json({
          success: true,
          response: "Não encontrei livros relacionados ao seu pedido. Tente reformular a sua pergunta.",
          recommendedBooks: [],
        });

        return;
      }

      res.status(200).json({
        success: true,
        response: result.response,
        recommendedBooks: result.recommendedBooks,
      });
    } catch (error: any) {
      console.error("❌ Erro ao recomendar produtos:", error);

      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
}
