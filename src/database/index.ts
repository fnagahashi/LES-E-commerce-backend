import { DataSource, DataSourceOptions } from "typeorm";
import path from "path";

const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: "localhost",
  port: 5433,
  username: "postgres",
  password: "nagahashi98", 
  database: "hotel_db",
  entities: [
    path.join(__dirname, "../entities/**/*.ts"),
    path.join(__dirname, "../entities/**/*.js")
  ],
  synchronize: true,
  logging: true,
};

export const AppDataSource = new DataSource(dataSourceOptions);

export const connectDatabase = async () => {
  try {
    const connection = await AppDataSource.initialize();
    console.log("✅ BANCO CONECTADO NO DOCKER!");
    return connection;
  } catch (error) {
    console.error("❌ Erro no banco:", error);
    throw error;
  }
};

export default connectDatabase;