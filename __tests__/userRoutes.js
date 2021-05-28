const request = require('supertest');
const app = require('../app');

let token;

beforeAll((done) => {
  const req = request(app.callback())
    .post('/api/v1/users/login')
    .auth('Kakos', '123')
    .end((err, req) => {
      token = req.body.token; // save the token!
      console.log('I HAVE THE TOKEN : ', token);
      done();
    });
});

describe('POST routes of Users', () => {
  it('should create a new user', async () => {
    const res = await request(app.callback())
      .post('/api/v1/users')
      .send({
        username: 'test1',
        email: 'unique_email@example.com',
        password: '123',
        firstName: 'TestName',
        lastName: 'TestLastName',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('created', true);
  });
  it('should login a user', async () => {
    const res = await request(app.callback())
      .post('/api/v1/users/login')
      .auth('test1', '123');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('log', true);
  });
  it('get all users', async () => {
    const req = await request(app.callback())
      .get('/api/v1/users')
      .set('Authorization', token);
    expect(req.statusCode).toEqual(201);
  });
});
