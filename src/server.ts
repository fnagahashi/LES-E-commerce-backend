import express, { NextFunction, Response, Request } from "express";
import "express-async-errors";
import "reflect-metadata";
import cors from "cors";

import router from "./routes";
import { AppDataSource } from "./database";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3006",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof Error) {
      response.status(400).send(err.message);
    } else {
      response.status(500).send("Erro interno");
    }
  }
);

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log("✅ Banco de dados conectado com sucesso!");
    app.use("/api", router);

    app.listen(3000, () => {
      console.log("🚀 Servidor rodando na porta 3000");
    });
  } catch (error) {
    console.error("❌ Erro ao conectar com o banco:", error);
    process.exit(1);
  }
};

startServer();
