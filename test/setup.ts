import { DataSource } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

export let app: INestApplication;
let dataSource: DataSource;

export async function createTestApp(): Promise<{
  app: INestApplication;
  dataSource: DataSource;
}> {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  // Get the DataSource that NestJS actually uses
  const dataSource = app.get(DataSource);

  return { app, dataSource };
}

beforeAll(async () => {
  const result = await createTestApp();
  app = result.app;
  dataSource = result.dataSource;
});

afterAll(async () => {
  await app.close();
  if (dataSource?.isInitialized) await dataSource.destroy();
});

beforeEach(async () => {
  const entities = dataSource.entityMetadatas;

  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);
    await repository.clear(); // truncate table
  }
});
