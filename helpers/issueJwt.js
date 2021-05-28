/**
 * A module to assign JWT to User.
 * @module helpers/issueJwt
 * @author Kyriakos Georgiades
 * @see schemas/* for JSON Schema definition files
 */

const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pathToKey = path.join(__dirname, '..', 'jwtRS256.key');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

/**
 * Function that issues the JWT for the given user
 * @param {object} user - User data.
 * @returns {object} - The token and when the token expires of the user
 */

function issueJWT(user) {
  const id = user[0].ID;
  const expiresIn = '1d';

  const payload = {
    sub: id,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn, algorithm: 'RS256' });

  return {
    token: `Bearer ${signedToken}`,
    expires: expiresIn,
  };
}

module.exports.issueJWT = issueJWT;
