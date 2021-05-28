const request = require('supertest');
const app = require('../app');

let token;
let dogID;

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

describe('GET routes of Dogs', () => {
  it('view all dogs', async () => {
    const req = await request(app.callback())
      .get('/api/v1/dogs');
    expect(req.statusCode).toEqual(201);
  });
  it('view a specific dog', async () => {
    const req = await request(app.callback())
      .get(`/api/v1/dogs/${35}`)
      .set('Authorization', token);
    expect(req.statusCode).toEqual(200);
  });
  it('search dog by filter & value', async () => {
    const req = await request(app.callback())
      .get('/api/v1/dogs/search?name=Hoody')
      .set('Authorization', token);
    expect(req.statusCode).toEqual(201);
  });
});

describe('POST routes of Dogs', () => {
  it('Create a dog', async () => {
    const req = await request(app.callback())
      .post('/api/v1/dogs')
      .send({
        name: 'TestingDOG',
        breed: 'TestBreed',
        sex: 'M',
      })
      .set('Authorization', token);
    dogID = req.body.ID;
    expect(req.statusCode).toEqual(201);
    expect(req.body).toHaveProperty('created', true);
  });
});

describe('PUT routes of Dogs', () => {
  it('Update a dog', async () => {
    const req = await request(app.callback())
      .put(`/api/v1/dogs/${dogID}`)
      .send({
        name: 'NEWNAME',
        sex: 'F',
      })
      .set('Authorization', token);
    expect(req.statusCode).toEqual(201);
    expect(req.body).toHaveProperty('updated', true);
  });
});

describe('DELETE routes of Dogs', () => {
  it('Delete a dog', async () => {
    const req = await request(app.callback())
      .delete(`/api/v1/dogs/${dogID}`)
      .set('Authorization', token);
    expect(req.statusCode).toEqual(200);
    expect(req.body).toHaveProperty('deleted', true);
  });
});
