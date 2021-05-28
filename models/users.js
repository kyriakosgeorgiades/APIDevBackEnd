/**
 * A module for the models for Users.
 * @module models/users
 * @author Kyriakos Georgiades
 */

/** Requiring function to validate User matching password */
const bcrypt = require('bcrypt');
const match = require('../helpers/match');
/** Requiring the database connection using knex */
const db = require('../config');
/** Requiring to hash passwords */

/**
   * Method to hash passwords
   * @param {int} saltRounds - Number of salt rounds.
   * @param {string} password - Password of the user.
   * @returns {string} Hashed password.
   */
function hashing(saltRounds, password) {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
}

/**
   * Method to get user by ID
   * @param {int} id - User ID.
   * @returns {object} User matching with the ID.
   * @catches {error} When there is an error with the database connection.
   */
exports.getById = async function getById(id) {
  let data = await db('users')
    .where({ ID: id })
    .catch(console.error);
  if (!data.length) {
    data = await db('workers')
      .where({ ID: id })
      .catch(console.error);
    return data;
  }
  return data;
};

/**
   * Method to get all the users
   * @param {int} page - Number of pages.
   * @param {int} limit - How many to show per page.
   * @param {string} order - Number of pages.
   * @returns {object} All of the users.
   * @catches {error} When there is an error connection with the database.
   */
exports.getAll = async function getAll(page, limit, order) {
  let data;
  if (order === 'DESC') {
    data = db('users')
      .orderBy('firstName', 'desc')
      .catch(console.error);
  } else if (order === 'ASC') {
    data = db('users')
      .orderBy('firstName', 'asc')
      .catch(console.error);
  }
  return data;
};

/**
   * Method to create a new user.
   * @param {object} user - User data.
   * @returns {object} The created user.
   * @catches {error} When there is an error connection with the database.
   */
exports.add = async function add(user) {
  const saltRounds = 10;
  const hashedPassword = hashing(saltRounds, user.password);
  let data;
  let shelter;
  if (user.code === undefined) {
    data = await db('users')
      .insert({ ...user, password: hashedPassword })
      .into('users')
      .catch(console.error);
    return data;
  } if (user.code != null) {
    shelter = await db('codesWorkers')
      .where({ Codes: user.code })
      .pluck('shelterID')
      .catch(console.error);
    if (shelter.length === 0) {
      return null;
    }
    delete user.code;
    data = await db.insert({ ...user, password: hashedPassword, shelterID: shelter })
      .into('workers')
      .catch(console.error);
    return data;
  }
  return null;
};

/**
   * Method to delete user based on ID.
   * @param {int} id - User ID.
   * @returns {boolean} Based if it deletedd the user or not.
   * @catches {error} When there is an error connection with the database.
   */
exports.delById = async function delById(id) {
  const data = await db('users')
    .where({ ID: id })
    .del()
    .catch(console.error);
  return data;
};

/**
   * Method to update an already existing user.
   * @param {object} user - User data to update.
   * @returns {object} The updated user.
   * @catches {error} When there is an error connection with the database.
   */
exports.update = async function update(user) {
  let data;
  let password;
  if (user.password != null) {
    user.password = hashing(10, user.password);
    password = user.password;
    data = await db('users')
      .where({ ID: user.ID })
      .update({ ...user, password })
      .catch(console.error);
  } else {
    data = await db('users')
      .where({ ID: user.ID })
      .update({ ...user })
      .catch(console.error);
  }
  return data;
};

/**
   * Method get user by Username.
   * @param {string} username - Users' username.
   * @returns {object} The matching user.
   * @catches {error} When there is an error connection with the database.
   */
exports.findByUsername = async function getByUsername(username) {
  let user = await db('users').where({ username }).catch(console.error);
  if (!user.length) {
    user = await db('workers').where({ username }).catch(console.error);
    return user;
  }
  return user;
};
