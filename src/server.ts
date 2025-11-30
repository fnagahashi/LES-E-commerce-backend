import express, {NextFunction, Response, Request} from "express";
import "express-async-errors";
import "reflect-metadata";
import connectDatabase from "./database/index";

import  router  from "./routes";

const app = express();

app.use(express.json());

app.use("/api", router);

app.use(
    (err:Error, request: Request, response:Response, next:NextFunction) => {
        if (err instanceof Error) {
            response.status(400).send(err.message)
        }
        else{
            response.status(500).send("Erro interno")
        }
    }
)

const startServer = async () => {
    try {
        await connectDatabase();
        console.log("✅ Banco de dados conectado com sucesso!");
        
        app.listen(3000);
        
    } catch (error) {
        console.error("❌ Erro ao conectar com o banco:", error);
        process.exit(1);
    }
}

startServer();