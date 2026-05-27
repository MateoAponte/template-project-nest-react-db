import request from 'supertest';

export const createUser = async (
  app: any,
  payload: any,
  code: number = 201,
) => {
  return await request(app.getHttpServer())
    .post('/api/v1/auth/register')
    .send(payload)
    .expect(code);
};
