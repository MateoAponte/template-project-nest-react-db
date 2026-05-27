import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { USER_CREDENTIALS } from 'test/constants/User';
import { UserActions } from 'test/utils/UserActions';
import { closeApp, initApp, truncateTables } from 'test/utils/initApp';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const testContext = await initApp();

    app = testContext.app;
    dataSource = testContext.dataSource;
  });
  afterEach(async () => {
    await truncateTables(dataSource);
  });
  afterAll(async () => {
    await closeApp(app);
  });

  // ── Register ────────────────────────────────────────────────────

  describe('POST /api/v1/auth/register', () => {
    it('registers a new user successfully', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(USER_CREDENTIALS.successUser)
        .expect(201);

      expect(res.body).toMatchObject({
        activities: expect.any(Array),
        email: USER_CREDENTIALS.successUser.email,
        id: expect.any(String),
        name: USER_CREDENTIALS.successUser.name,
        rol: expect.any(Number),
      });
    });

    it('returns 409 if email already exists', async () => {
      await UserActions.create(app, USER_CREDENTIALS.successUser);

      await UserActions.create(app, USER_CREDENTIALS.successUser, 409);
    });

    it('returns 400 for invalid payload', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(USER_CREDENTIALS.invalidUser)
        .expect(400);
    });
  });

  // ── Login ───────────────────────────────────────────────────────

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await UserActions.create(app, USER_CREDENTIALS.successUser, 201);
    });

    it('logs in with valid credentials', async () => {
      const res = await UserActions.login(
        app,
        USER_CREDENTIALS.successUserCodificated,
        201,
      );

      expect(res.body).toMatchObject({
        at_secret: expect.any(String),
        rt_secret: expect.any(String),
        user: {
          activities: expect.any(Array),
          email: USER_CREDENTIALS.successUser.email,
          id: expect.any(String),
          name: USER_CREDENTIALS.successUser.name,
          rol: expect.any(Number),
        },
      });
    });

    it('returns 401 for wrong password', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(USER_CREDENTIALS.wrongPasswordUser)
        .expect(401);
    });

    it('returns 401 for non-existent email', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(USER_CREDENTIALS.nonExistentEmailUser)
        .expect(401);
    });

    it('returns 400 for missing fields', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(USER_CREDENTIALS.justEmailUser)
        .expect(400);
    });
  });
});
