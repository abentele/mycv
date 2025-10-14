import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// Load the correct .env file
dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});

export const typeOrmConfig = (): DataSourceOptions => {
  const isProd = process.env.NODE_ENV === 'production';
  const isSQLite = process.env.DB_TYPE === 'sqlite';

  const common = {
    synchronize: false, // always false for migrations
    logging: !isProd,
    autoLoadEntities: true,
  };

  if (isSQLite) {
    return {
      type: 'sqlite',
      database: process.env.DB_PATH ?? 'dev.sqlite',
      ...common,
    };
  }

  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ...common,
  };
};
