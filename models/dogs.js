/**
 * A module for the models for Dogs.
 * @module models/dogs
 * @author Kyriakos Georgiades
 */

/** Requiring the database connection using knex */
const db = require('../config');

// exports.getByName = async function getByName (name) {
//   const data = await db('dogs').where({name: name})
//  .catch(console.error);
//  return data
// }

/**
   * Method to search dogs based on filters
   * @param {string} filter - Value from the URL filter.
   * @param {string} value - Value of the search bar.
   * @returns {object} Dogs matching the filter.
   * @catches {error} When there are not matches.
   */
exports.searchDog = async function searchDog(filter, value) {
  const data = await db('dogs').where(filter, 'like', value)
    .catch(console.error);
  return data;
};

/**
   * Method to search dogs based on ID
   * @param {int} id -  ID of the Dog.
   * @returns {object} Single Dog of the matching ID.
   * @catches {error} When there are not matches.
   */
exports.getById = async function getById(id) {
	console.log("I HAVE THE DOG ID");
  const data = await db('dogs').where({ ID: id })
    .catch(console.error);
  return data;
};

/**
   * Method to return all the dogs.
   * @param {int} page - Number of pages.
   * @param {int} limit - Number of dogs to show.
   * @returns {object} All the dogs from the database
   * @catches {error} When there is connection error with the database.
   */
exports.getAll = async function getAll(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const data = await db('dogs').limit(limit).offset(offset)
    .catch(console.error);
  return data;
};

/**
   * Method to return all the dogs.
   * @param {int} page - Number of pages.
   * @param {int} limit - Number of dogs to show.
   * @returns {object} All the dogs from the database
   * @catches {error} When there is connection error with the database.
   */
exports.add = async function add(dog) {
  const data = await db.insert({ ...dog })
    .into('dogs')
    .catch(console.error);
  return data;
};

/**
   * Method to delete a single dog based on ID.
   * @param {int} id - ID of the dog.
   * @returns {boolean} Based if it was deleted or not.
   * @catches {error} When there is connection error with the database.
   */
exports.delById = async function delById(id) {
  const data = await db('dogs')
    .where({ ID: id })
    .del()
    .catch(console.error);
  return data;
};

/**
   * Method to delete a single dog based on ID.
   * @param {object} dog - New data values to be update for the dog.
   * @returns {object} The dog with its new values.
   * @catches {error} When there is connection error with the database.
   */
exports.update = async function update(dog) {
  const data = await db('dogs')
    .where({ ID: dog.ID })
    .update({ ...dog })
    .catch(console.error);
  return data;
};
