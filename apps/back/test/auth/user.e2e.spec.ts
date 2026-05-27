import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { closeApp, initApp, truncateTables } from 'test/utils/initApp';
import { UserActions } from 'test/utils/UserActions';
import { USER_CREDENTIALS } from 'test/constants/User';

describe('User Controller (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let accessToken: string;
  let userId: string;
  let permissions = {
    rol: 0,
    activities: [0, 1, 2, 3],
  };

  beforeAll(async () => {
    const testContext = await initApp();

    app = testContext.app;
    dataSource = testContext.dataSource;
  });

  beforeEach(async () => {
    const registerResponse = await UserActions.create(app, {
      ...USER_CREDENTIALS.successUser,
      ...permissions,
    });

    userId = registerResponse.body.id;

    const loginResponse = await UserActions.login(
      app,
      USER_CREDENTIALS.successUserCodificated,
    );

    accessToken = loginResponse.body.at_secret;

    expect(userId).toBeDefined();
    expect(accessToken).toBeDefined();
  });

  afterEach(async () => {
    await truncateTables(dataSource);
  });

  afterAll(async () => {
    await closeApp(app);
  });

  describe('GET /api/v1/user', () => {
    it('should return all users', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/user')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: userId,
            name: USER_CREDENTIALS.successUser.name,
            email: USER_CREDENTIALS.successUser.email,
          }),
        ]),
      );

      expect(response.body[0].password).toBeUndefined();
    });
  });

  describe('GET /api/v1/user/:id', () => {
    it('should return one user by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/user/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: userId,
          name: USER_CREDENTIALS.successUser.name,
          email: USER_CREDENTIALS.successUser.email,
        }),
      );

      expect(response.body.password).toBeUndefined();
    });

    it('should return 404 when user does not exist', async () => {
      const fakeId = 'ba0b137d-bc57-4eb1-9600-2704bf72fd23';

      const response = await request(app.getHttpServer())
        .get(`/api/v1/user/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      expect(response.body.message).toBe(`User with id ${fakeId} not found`);
    });
  });

  describe('PATCH /api/v1/user/:id', () => {
    it('should update user by id', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/user/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'John Doe 2',
          email: 'john-updated@example.com',
          password: 'Abcd!123456789',
        })
        .expect(204);

      const response = await request(app.getHttpServer())
        .get(`/api/v1/user/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: userId,
          name: 'John Doe 2',
          email: 'john-updated@example.com',
        }),
      );

      expect(response.body.password).toBeUndefined();
    });

    it('should return 404 when updating non-existent user', async () => {
      const fakeId = 'ba0b137d-bc57-4eb1-9600-2704bf72fd23';

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/user/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'John Doe 2',
          email: 'john-updated@example.com',
          password: 'Abcd!123456789',
        })
        .expect(404);

      expect(response.body.message).toBe(`User with id ${fakeId} not found`);
    });
  });

  describe('DELETE /api/v1/user/:id', () => {
    it('should delete user by id', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/user/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);

      const response = await request(app.getHttpServer())
        .get(`/api/v1/user/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      expect(response.body.message).toBe(`User with id ${userId} not found`);
    });

    it('should return 404 when deleting non-existent user', async () => {
      const fakeId = 'ba0b137d-bc57-4eb1-9600-2704bf72fd23';

      const response = await request(app.getHttpServer())
        .delete(`/api/v1/user/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      expect(response.body.message).toBe(`User with id ${fakeId} not found`);
    });
  });
});
