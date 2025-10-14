import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import AppDataSource from './data-source';
import { DataSource } from 'typeorm';

/** Runs the database migration scripts on every startup of the application.
 * Works also for e2e tests.
 */
@Injectable()
export class DatabaseMigrationsService implements OnApplicationBootstrap {
  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap() {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }

    await this.dataSource.runMigrations();
  }
}
