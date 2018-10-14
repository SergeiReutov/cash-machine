const request = require('supertest');
const app = require('../app');
const InvalidArgumentException = require('../exceptions/InvalidArgumentException');

describe('Test the withdraw path', () => {
  test('It should response OK to the correct PUT method', () => {
    return request(app)
      .put('/api/withdraw')
      .send({ amount: 180 })
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
  });

  test('It should response ERROR to the incorrect PUT method', () => {
    const expectedException = new InvalidArgumentException();
    return request(app)
      .put('/api/withdraw')
      .send({ amount: 'wrong' })
      .then(response => {
        expect(response.body.error).toEqual(expectedException);
        expect(response.statusCode).toBe(500);
      });
  });
});
