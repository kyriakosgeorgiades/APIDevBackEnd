/**
 * A module to validate basic authentication on request/response data.
 * @module controllers/authJWT
 * @author Kyriakos Georgiades
 */

const passport = require('koa-passport');

/** JWTAuth storing the validation result
 * @see stategies/basic for the validation method of basic authentication
 * */
const basicAuth = require('../strategies/basic');

passport.use(basicAuth);

/** Validate requester of basic authentication */
module.exports = passport.authenticate(['basic'], { session: false });
