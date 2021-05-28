/**
 * A module for the permissions for Favourites.
 * @module permissions/favourites
 * @author Kyriakos Georgiades
 */

const AccessControl = require('role-acl');

const ac = new AccessControl();

/** Granting permissions for the users to read favourite list */
ac
  .grant('user')
  .execute('read')
  .on('userFav');

/** Granting permissions for the users create a favourite list */
ac
  .grant('user')
  .execute('create')
  .on('userFav');

/** Granting permissions for the users delete a dog from their own favourite list */
ac
  .grant('user')
  .condition({ Fn: 'EQUALS', args: { requester: '$.owner' } })
  .execute('delete')
  .on('userFav');

/**
   * Method verify requester has permissions read favourite list.
   * @param {object} requester - Requester of the CRUD operation.
   * @returns {boolean} True for grant/False for deny.
   */
exports.readAll = (requester) => ac
  .can(requester[0].role)
  .execute('read')
  .sync()
  .on('userFav');

/**
   * Method verify requester has permissions delete a dog from their own favourite list.
   * @param {object} requester - Requester of the CRUD operation.
   * @param {object} data - Data requsting to be deleted.
   * @returns {boolean} True for grant/False for deny.
   */
exports.delete = (requester, data) => {
  const requesterID = parseInt(requester[0].ID, 10);
  const ownerID = parseInt(data, 10);
  return ac
    .can(requester[0].role)
    .context({ requester: requesterID, owner: ownerID })
    .execute('delete')
    .sync()
    .on('userFav');
};

/**
   * Method verify requester has permissions to create a favourite list.
   * @param {object} requester - Requester of the CRUD operation.
   * @returns {boolean} True for grant/False for deny.
   */
exports.create = (requester) => ac
  .can(requester[0].role)
  .execute('create')
  .sync()
  .on('userFav');
