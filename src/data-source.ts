import { DataSource } from 'typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { join } from 'path';

// Reuse shared config
const baseConfig = typeOrmConfig();

// Create the DataSource for CLI
const AppDataSource = new DataSource({
  ...baseConfig,
  synchronize: false,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
});

export default AppDataSource; // ✅ only default export
