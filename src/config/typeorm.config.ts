import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// Load the right .env file before anything else
dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});

/**
 * Builds a TypeORM config object that supports both Postgres and SQLite.
 */
export const typeOrmConfig = (): TypeOrmModuleOptions => {
  const common = {
    autoLoadEntities: true,
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV !== 'production',
  };

  if (process.env.DB_TYPE === 'sqlite') {
    return {
      type: 'sqlite',
      database: process.env.DB_PATH ?? 'dev.sqlite',
      ...common,
    } as TypeOrmModuleOptions;
  }

  // Default to Postgres
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ...common,
  } as TypeOrmModuleOptions;
};

/**
 * Shared DataSource for TypeORM CLI (migrations, schema sync, etc.)
 */
export const typeOrmDataSource = new DataSource(
  typeOrmConfig() as DataSourceOptions,
);
