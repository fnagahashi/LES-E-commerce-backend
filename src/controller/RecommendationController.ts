import { Request, Response } from "express";
import Facade from "../facade/Facade";
import ChatRecommendation from "../entities/chatRecommendation";
import Client from "../entities/client";

export class RecommendationController {
  constructor(
    private readonly facade: Facade
  ) {}

  async recommend(
    req: Request,
    res: Response
  ): Promise<void> {

    try {
      const {
        clientId,
        message,
      } = req.body;

      if (!message) {
        res.status(400).json({
          success: false,
          error: "Mensagem é obrigatória",
        });
        return;
      }

      const client =
        (await this.facade.findById(
          "Client",
          clientId
        )) as Client;

      if (!client) {
        res.status(404).json({
          success: false,
          error:
            "Cliente não encontrado",
        });
        return;
      }

      const recommendation =
        new ChatRecommendation(
          client,
          message
        );

      const result =
        await this.facade
        .recommendProducts(
          recommendation
        );

      res.status(200).json({
        success: true,
        response:
          result.response,
        recommendedBooks:
          result.recommendedBooks,
      });

    } catch (error: any) {

      console.error(
        "❌ Erro ao recomendar produtos:",
        error
      );

      res.status(400).json({
        success: false,
        error:
          error.message,
      });
    }
  }
}