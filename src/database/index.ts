import { DataSource } from "typeorm";
import path from "path";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "hotel_db",
  
  entities: [
    path.join(__dirname, "../entities/**/*.ts"),
    path.join(__dirname, "../entities/**/*.js")
  ],
  
  migrations: [
    path.join(__dirname, "../migrations/**/*.ts"),
    path.join(__dirname, "../migrations/**/*.js")
  ],
  
  synchronize: true,
  
  logging: process.env.NODE_ENV === "development",
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log("✅ Data Source inicializado com sucesso!");
    console.log("📊 Tabelas criadas/atualizadas automaticamente");
  } catch (error) {
    console.error("❌ Erro durante a inicialização do Data Source:", error);
    throw error;
  }
};

export default connectDatabase;