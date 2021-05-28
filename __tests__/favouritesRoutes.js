const request = require('supertest');
const app = require('../app');

let token;

beforeAll((done) => {
  const req = request(app.callback())
    .post('/api/v1/users/login')
    .auth('troll', '123')
    .end((err, req) => {
      token = req.body.token; // save the token!
      console.log('I HAVE THE TOKEN : ', token);
      done();
    });
});

describe('POST routes of Favourites', () => {
  it('Add a dog to user favourite list', async () => {
    const req = await request(app.callback())
      .post(`/api/v1/favs/${35}`)
      .set('Authorization', token);
    expect(req.statusCode).toEqual(201);
    expect(req.body).toHaveProperty('created', true);
  });
});

describe('GET routes of Favourites', () => {
  it('view all favourite dogs', async () => {
    const req = await request(app.callback())
      .get('/api/v1/favs')
      .set('Authorization', token);
    expect(req.statusCode).toEqual(201);
  });
  it('select a single dog from favourite list', async () => {
    const req = await request(app.callback())
      .get(`/api/v1/favs/${35}`)
      .set('Authorization', token);
    expect(req.statusCode).toEqual(201);
  });
});

describe('DELETE routes of Favourites', () => {
  it('Removes a single dog from the favourite list', async () => {
    const req = await request(app.callback())
      .delete(`/api/v1/favs/${35}`)
      .set('Authorization', token);
    expect(req.statusCode).toEqual(201);
    expect(req.body).toHaveProperty('deleted', true);
  });
});
