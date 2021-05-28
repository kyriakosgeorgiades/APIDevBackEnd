/**
 * A module for the models for Shelters.
 * @module models/shelters
 * @author Kyriakos Georgiades
 */

const db = require('../config');

/**
   * Method to fetch the shelter by its location.
   * @param {string} address - Location of the shelter.
   * @returns {object} Shelter matching the criteria.
   * @catches {error} When there is an error with connecting to the database.
   */
exports.getByName = async function getByAddress(address) {
  const data = await db('shelters')
    .where({ address })
    .catch(console.error);
  return data;
};

/**
   * Method to fetch the shelter by its ID.
   * @param {string} id - ID of the shelter.
   * @returns {object} Dog matching the criteria.
   * @catches {error} When there is an error with connecting to the database.
   */
exports.getById = async function getById(id) {
  const data = await db('shelters').where({ ID: id });
  return data;
};

/**
   * Method to fetch the shelters.
   * @param {int} page - Number of pages.
   * @param {int} limit - Limit of how many to show at each page.
   * @param {string} order - Order to be displayed.
   * @returns {object} The shelters in order.
   * @catches {error} When there is an error with connecting to the database.
   */
exports.getAll = async function getAll(page, limit, order) {
  let data;
  if (order === 'DESC') {
    data = db('shelters').orderBy(order, 'desc');
  } else if (order === 'ASC') {
    data = db('shelters').orderBy(order, 'asc');
  }
  return data;
};

/**
   * Method to add a shelter.
   * @param {object} shelter - The data of the shelter.
   * @param {string} order - Order to be displayed.
   * @returns {object} The shelter added.
   * @catches {error} When there is an error with connecting to the database.
   */
exports.add = async function add(shelter) {
  const data = db.insert({ ...shelter }).into('shelters');
  return data;
};

/**
   * Method to delete a shelter.
   * @param {int} id - ID of the shelter.
   * @returns {boolean} True if it was deleted false if not.
   * @catches {error} When there is an error with connecting to the database.
   */
exports.delById = async function delById(id) {
  const data = await db('shelters')
    .where({ ID: id })
    .del()
    .catch(console.error);
  return data;
};

/**
   * Method to update a shelter.
   * @param {object} shelter - Data of the shelter to be updated.
   * @returns {object} The updated version of the shelter.
   * @catches {error} When there is an error with connecting to the database.
   */
exports.update = async function update(shelter) {
  const data = await db('shelters')
    .where({ ID: shelter.ID })
    .update({ ...shelter })
    .catch(console.error);
  return data;
};
