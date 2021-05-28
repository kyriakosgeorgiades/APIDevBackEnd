/**
 * A module to check if the user exists in the db with the correct password.
 * @module helpers/match
 * @author Kyriakos Georgiades
 * @see schemas/* for JSON Schema definition files
 */

const bcrypt = require('bcrypt');
const users = require('../models/users');

/**
 * Function checks input password matching with stored password
 * @param {object} user - User data.
 * @param {string} password - Input password.
 * @returns {boolean} - Returns True/False based on the codition.
 */
const verifyPassword = function (user, password) {
  // compare hash of password with the stored hash in the DB
  const isMatch = bcrypt.compareSync(password, user.password);
  return isMatch;
};

/**
 * Method validating the user credentials.
 * @param {string} username - Username of the user.
 * @param {string} password - Password of the user.
 * @param {function} done - Callback function.
 * @returns {boolean} - Returns True/False based on the codition.
 * @catches {error} When user not found.
 */
const checkUserAndPass = async (username, password, done) => {
  // look up the user and check the password if the user exists
  // call done() with either an error or the user, depending on outcome
  let result;

  try {
    result = await users.findByUsername(username);
  } catch (error) {
    console.error(`Error during authentication for user ${username}`);
    return done(error);
  }

  if (result.length) {
    const user = result[0];
    if (verifyPassword(user, password)) {
      console.log(`Successfully authenticated user ${username}`);
      return done(null, user);
    }
    console.log(`Password incorrect for user ${username}`);
  } else {
    console.log(`No user found with username ${username}`);
  }
  return done(null, false);
};

module.exports = checkUserAndPass;
