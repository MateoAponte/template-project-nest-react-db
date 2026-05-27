// test/setup-app.ts

import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';

export async function initApp() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.init();

  const dataSource = moduleFixture.get(DataSource);

  return {
    app,
    dataSource,
  };
}
export const truncateTables = async (dataSource: DataSource) => {
  const tableNames = dataSource.entityMetadatas
    .map((entity) => `"${entity.tableName}"`)
    .join(', ');

  if (tableNames) {
    await dataSource.query(
      `TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;`,
    );
  }
};
export const closeApp = async (app: any) => {
  await app.close();
};
