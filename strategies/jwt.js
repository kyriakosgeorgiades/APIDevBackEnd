const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const fs = require('fs');
const path = require('path');
const utf8 = require('utf8');
const users = require('../models/users');

const pathToKey = path.join(__dirname, '..', 'jwtRS256.key.pub');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
  maxAge: '2d',
};

const strategy = new JwtStrategy(options, (payload, done) => {
  users.getById(payload.sub)
    .then((user) => {
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    })
    .catch((err) => done(err, null));
});

module.exports = strategy;
