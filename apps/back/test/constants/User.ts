export const USER_CREDENTIALS = {
  successUser: {
    name: 'John Doe',
    email: 'john@example2.com',
    password: 'Abcd!123456789',
  },
  successUserCodificated: {
    email: 'john@example2.com',
    password: 'QWJjZCExMjM0NTY3ODk=',
  },
  wrongPasswordUser: {
    email: 'john@example.com',
    password: 'wrongpassword',
  },
  nonExistentEmailUser: {
    email: 'nobody@example.com',
    password: 'QWJjZCExMjM0NTY3ODk=',
  },
  justEmailUser: {
    email: 'john@example.com',
  },
  invalidUser: {
    email: 'not-an-email',
    password: '123',
  },
};
