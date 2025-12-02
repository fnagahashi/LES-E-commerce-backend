import { DataSource, DataSourceOptions } from "typeorm";
import path from "path";

export const AppDataSource = new DataSource(
  require("../../ormconfig") as DataSourceOptions
);
