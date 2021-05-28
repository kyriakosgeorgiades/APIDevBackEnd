const Koa = require('koa');

const app = new Koa();

const cors = require('@koa/cors');
const users = require('./routes/users.js');
const dogs = require('./routes/dogs.js');
const shelters = require('./routes/shelters.js');
const favs = require('./routes/favourites.js');

app.use(cors());
app.use(users.routes());
app.use(dogs.routes());
app.use(shelters.routes());
app.use(favs.routes());

module.exports = app;
