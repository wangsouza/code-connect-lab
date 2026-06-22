import 'reflect-metadata';
import { DataSource } from 'typeorm';

/**
 * DataSource usado pela CLI do TypeORM (migrations) e pelo script de seed.
 * Lê as mesmas variáveis de ambiente do AppModule, com os mesmos defaults
 * (compatíveis com o docker-compose).
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'codeconnect',
  password: process.env.DB_PASSWORD ?? 'codeconnect',
  database: process.env.DB_NAME ?? 'codeconnect',
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: false,
});

export default AppDataSource;
