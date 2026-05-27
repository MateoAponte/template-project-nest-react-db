import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('http://localhost:3000/products', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'Product 1',
        image: 'https://picsum.photos/id/10/400/200',
        price: 100,
        category: 'Category 1',
      },
    ]);
  }),

  http.post('http://localhost:3000/auth/login', () => {
    return HttpResponse.json({
      accessToken: 'fake-token',
      user: {
        id: '1',
        email: 'test@test.com',
      },
    });
  }),
];
