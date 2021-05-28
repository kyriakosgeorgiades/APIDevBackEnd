/**
 * A module to validate JWT on request/response data.
 * @module controllers/authJWT
 * @author Kyriakos Georgiades
 */

/** passport requires the libriary of koa-passport to use the JWT validation */
const passport = require('koa-passport');
/** JWTAuth storing the validation result
 * @see stategies/jwt for the validation method of JWT
 * */
const JWTAuth = require('../strategies/jwt');

passport.use(JWTAuth);

/** Validate requester of JWT */
module.exports = passport.authenticate('jwt', { session: false });
