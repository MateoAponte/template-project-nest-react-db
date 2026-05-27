import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserActions } from 'test/utils/UserActions';
import { USER_CREDENTIALS } from 'test/constants/User';
import { closeApp, initApp, truncateTables } from 'test/utils/initApp';
import { log } from 'node:console';

describe('Auth refresh/encrypt endpoints', () => {
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

  describe('POST /api/v1/auth/encrypt', () => {
    it('should encrypt access and refresh token secrets', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/encrypt')
        .send({
          at_secret:
            'ab94bf198da90b69bcd51defadfa78537a57892656217f8a3999d88071548805546f3e5736fb34466ea6a68af03a48150b8e46f859161916eb972c5497b02b92',
          rt_secret:
            '995e730f18c327841d24180e01db7a332a6a5efaf503aaa03d43f70dd783998b1fbea6ce2590ddcb71bfb08f7839def6fe0ae81faa6b6e79815aa8c43a74b6e6',
        })
        .expect(201);

      expect(response.body).toEqual({
        at_secret: expect.any(String),
        rt_secret: expect.any(String),
      });

      expect(response.body.at_secret).toMatch(/^v1\./);
      expect(response.body.rt_secret).toMatch(/^v1\./);

      expect(response.body.at_secret).not.toContain('ab94bf');
      expect(response.body.rt_secret).not.toContain('995e73');
    });

    it('should fail when at_secret is missing', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/encrypt')
        .send({
          rt_secret:
            '995e730f18c327841d24180e01db7a332a6a5efaf503aaa03d43f70dd783998b',
        })
        .expect(400);
    });

    it('should fail when rt_secret is missing', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/encrypt')
        .send({
          at_secret:
            'ab94bf198da90b69bcd51defadfa78537a57892656217f8a3999d880715488055',
        })
        .expect(400);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should refresh tokens when refresh token is valid', async () => {
      await UserActions.create(app, USER_CREDENTIALS.successUser);

      const loginResponse = await UserActions.login(
        app,
        USER_CREDENTIALS.successUserCodificated,
      );

      log(loginResponse.body.rt_secret);
      const refreshToken = loginResponse.body.rt_secret;

      expect(refreshToken).toBeDefined();

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(201);

      expect(response.body).toEqual({
        at_secret: expect.any(String),
        rt_secret: expect.any(String),
      });
    });

    it('should fail when authorization header is missing', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .expect(401);
    });

    it('should fail when token is invalid', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .set('Authorization', 'Bearer invalid.token.value')
        .expect(401);
    });

    it('should fail when using access token instead of refresh token', async () => {
      await UserActions.create(app, USER_CREDENTIALS.successUser);

      const loginResponse = await UserActions.login(
        app,
        USER_CREDENTIALS.successUserCodificated,
      );

      const accessToken = loginResponse.body.at_secret;

      expect(accessToken).toBeDefined();

      await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401);
    });
  });
});
