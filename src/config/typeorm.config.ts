import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load the correct .env file
switch (process.env.NODE_ENV) {
  case 'production':
    dotenv.config({ path: '.env.production' });
    break;
  case 'test':
    dotenv.config({ path: '.env.test' });
    break;
  case 'development':
    dotenv.config({ path: '.env.development' });
    break;
  default:
    throw new Error(
      `NODE_ENV value "${process.env.NODE_ENV}" is not valid. Use "development", "test" or "production".`,
    );
}

export const typeOrmConfig = (): DataSourceOptions => {
  const env = process.env.NODE_ENV;

  const common = {
    synchronize: false, // always false when using migrations
    logging: env !== 'production',
    autoLoadEntities: true,
  };

  switch (env) {
    case 'production':
      return {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        migrations: [join(__dirname, '../migrations/*.{ts,js}')], // <-- must include migrations
        ssl: {
          rejectUnauthorized: false,
        },
        ...common,
      } as DataSourceOptions;
    case 'test':
      return {
        type: 'sqlite',
        database: ':memory:', // in-memory DB for tests
        migrations: [join(__dirname, '../migrations/*.{ts,js}')], // <-- must include migrations
        ...common,
      } as DataSourceOptions;
    case 'development':
      return {
        type: 'sqlite',
        database: process.env.DB_PATH ?? 'dev.sqlite',
        migrations: [join(__dirname, '../migrations/*.{ts,js}')], // <-- must include migrations
        ...common,
      } as DataSourceOptions;
    default:
      throw new Error(
        `NODE_ENV value "${env}" is not valid. Use "development", "test" or "production".`,
      );
  }
};
