import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const myDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/infrastructure/entities/*.ts'],
  logging: false,
  synchronize: true,
});
