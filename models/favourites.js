/**
 * A module for the models for Favourites.
 * @module models/favourites
 * @author Kyriakos Georgiades
 */

/** Requiring the database connection using knex */
const db = require('../config');

/**
   * Method to fetch the dog from the user it got favourite clicked by.
   * @param {int} id_dog - ID of the dog.
   * @param {object} id_user - User requesting this action.
   * @returns {object} Dog matching the criteria.
   * @catches {error} When there is an error with connecting to the database.
   */
exports.getById = async function getById(idDog, idUser) {
  const data = await db.select('userID', 'dogID').from('userFav').where({ userID: idUser, dogID: idDog })
    .catch(console.error);
  return data;
};

exports.getAllFavs = async function getAllFavs(dogID) {
  const data = await db('dogs').where({ ID: dogID }).catch(console.error);
  return data;
};

/**
   * Method to get all the favourites dogs from the requester User.
   * @param {int} id_user - Id of the user.
   * @returns {object} Dogs favourited by the user.
   * @catches {error} When there is an error connection with the database.
   */
exports.getAll = async function getAll(idUser) {
  const data = await db.select('dogID').from('userFav').where({ userID: idUser })
    .catch(console.error);
  return data;
};

/**
   * Method add a dog to User favourite list
   * @param {object} dog - Dog data in the object.
   * @param {object} user - User data in the object.
   * @returns {object} Returns all the favoutires dogs .
   * @catches {error} When there are not matches.
   */
exports.add = async function add(dog, user) {
  const data = await db.insert({ userID: user[0].ID, dogID: dog.ID, shelterID: dog.shelterID })
    .into('userFav')
    .catch(console.error);
  return data;
};

/**
   * Method to delete dog from favourite list
   * @param {int} id_dog - ID of the dog.
   * @param {int} id_user - ID of the user.
   * @returns {boolean} Returns bool value based if it got deleted or not .
   * @catches {error} When there is an error connection with the database.
   */
exports.delById = async function delById(idDog, idUser) {
  const data = await db('userFav')
    .where({ userID: idUser, dogID: idDog })
    .del()
    .catch(console.error);
  return data;
};
