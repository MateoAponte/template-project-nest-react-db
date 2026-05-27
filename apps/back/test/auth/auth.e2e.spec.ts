import { Test, type TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';
import { createUser } from 'test/utils/createUser';

const successUser = {
  name: 'John Doe',
  email: 'john@example2.com',
  password: 'Abcd!123456789',
};

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Misma configuración que main.ts
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );

    await app.init();

    dataSource = moduleFixture.get(DataSource);
  });

  afterAll(async () => {
    // Limpia la BD de test y cierra la app
    await dataSource.dropDatabase();
    await app.close();
  });

  afterEach(async () => {
    // Limpia tablas entre tests para evitar conflictos
    const entities = dataSource.entityMetadatas;
    for (const entity of entities) {
      const repo = dataSource.getRepository(entity.name);
      await repo.clear();
    }
  });

  // ── Register ────────────────────────────────────────────────────

  describe('POST /api/v1/auth/register', () => {
    it('registers a new user successfully', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(successUser)
        .expect(201);

      expect(res.body).toMatchObject({
        activities: expect.any(Array),
        email: successUser.email,
        id: expect.any(String),
        name: successUser.name,
        rol: expect.any(Number),
      });
    });

    it('returns 409 if email already exists', async () => {
      await createUser(app, successUser);

      await createUser(app, successUser, 409);
    });

    it('returns 400 for invalid payload', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ email: 'not-an-email', password: '123' })
        .expect(400);
    });
  });

  // ── Login ───────────────────────────────────────────────────────

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Crea el usuario antes de cada test de login
      await createUser(app, successUser, 201);
    });

    it('logs in with valid credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'john@example2.com',
          password: 'QWJjZCExMjM0NTY3ODk=', // base64 de Abcd!123456789
        })
        .expect(201);

      console.log('LOGIN RESPONSE:', JSON.stringify(res.body, null, 2));

      expect(res.body).toMatchObject({
        at_secret: expect.any(String),
        rt_secret: expect.any(String),
        user: {
          activities: expect.any(Array),
          email: successUser.email,
          id: expect.any(String),
          name: successUser.name,
          rol: expect.any(Number),
        },
      });
    });

    it('returns 401 for wrong password', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('returns 401 for non-existent email', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'nobody@example.com',
          password: 'QWJjZCExMjM0NTY3ODk=',
        })
        .expect(401);
    });

    it('returns 400 for missing fields', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'john@example.com' })
        .expect(400);
    });
  });
});
