import request from 'supertest';

export class UserActions {
  static async create(app: any, user: any, statusCode = 201) {
    return request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(user)
      .expect(statusCode);
  }

  static async login(app: any, user: any, statusCode = 201) {
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send(user)
      .expect(statusCode);
  }
}
