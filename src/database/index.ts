import { createConnection, ConnectionOptions } from "typeorm";
import path from "path";

const connectionOptions: ConnectionOptions = {
  type: "postgres",
  host: "localhost",
  port: 5433,  // ⭐ PORTA DO DOCKER ⭐
  username: "postgres",
  password: "password", 
  database: "hotel_db",
  entities: [
    path.join(__dirname, "../entities/**/*.ts"),
    path.join(__dirname, "../entities/**/*.js")
  ],
  synchronize: true,  // ⭐ CRIA TABELAS SOZINHO ⭐
  logging: true,
};

export const connectDatabase = async () => {
  try {
    const connection = await createConnection(connectionOptions);
    console.log("✅ BANCO CONECTADO NO DOCKER!");
    return connection;  // ⭐ RETORNA A CONEXÃO ⭐
  } catch (error) {
    console.error("❌ Erro no banco:", error);
    throw error;
  }
};

export default connectDatabase;