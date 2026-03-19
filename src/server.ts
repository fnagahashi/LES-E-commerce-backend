import express from "express";
import "express-async-errors";
import "reflect-metadata";
import cors from "cors";

import { createRouter } from "./routes";
import { AppDataSource } from "./database";

const app = express();

app.use(cors());
app.use(express.json());

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log("✅ Banco conectado");

    const router = createRouter(); // ✅ AGORA seguro

    app.use("/api", router);

    // middleware de erro DEPOIS das rotas
    app.use((err: any, req: any, res: any, next: any) => {
      res.status(400).json({
        success: false,
        error: err.message,
      });
    });

    app.listen(3000, () => {
      console.log("🚀 Rodando na porta 3000");
    });
  } catch (error) {
    console.error("Erro ao iniciar:", error);
  }
};

startServer();