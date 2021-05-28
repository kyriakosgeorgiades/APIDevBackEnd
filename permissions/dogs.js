/**
 * A module for the permissions for Dogs.
 * @module permissions/dogs
 * @author Kyriakos Georgiades
 */

const AccessControl = require('role-acl');

const ac = new AccessControl();

// controls for CRUD operations on dogs

/** Granting permissions for the workers to create dogs */
ac
  .grant('worker')
  .execute('create')
  .on('dog');

/** Granting permissions for the workers update a dog ONLY on their location of work */
ac
  .grant('worker')
  .condition({ Fn: 'EQUALS', args: { requester: '$.owner' } })
  .execute('update')
  .on('dog');

/** Granting permissions for the workers delete a dog ONLY on their location of work */
ac
  .grant('worker')
  .condition({ Fn: 'EQUALS', args: { requester: '$.owner' } })
  .execute('delete')
  .on('dog');

/** Granting permissions admin to create a dog */
ac
  .grant('admin')
  .execute('create')
  .on('dog');

/** Granting permissions for the admin to update a dog */
ac
  .grant('admin')
  .execute('update')
  .on('dogs');

/** Granting permissions for admin to delete a dog */
ac
  .grant('admin')
  .execute('delete')
  .on('dog');

/**
   * Method verify requester has permissions to update a dog by matching shelterIDs of requster vs dog.
   * @param {object} requester - Requester of the CRUD operation.
   * @param {object} data - Data of the update CRUD operation.
   * @returns {boolean} True for grant/False for deny.
   */
exports.update = (requester, data) => {
  const requesterID = parseInt(requester[0].shelterID, 10);
  const dogshelterID = parseInt(data, 10);
  return ac
    .can(requester[0].role)
    .context({ requester: requesterID, owner: dogshelterID })
    .execute('update')
    .sync()
    .on('dog');
};

/**
   * Method verify requester has permissions to update a dog by matching shelterIDs of requster vs dog.
   * @param {object} requester - Requester of the CRUD operation.
   * @param {object} data - Data of the update CRUD operation.
   * @returns {boolean} True for grant/False for deny.
   */
exports.delete = (requester, data) => {
  const requesterID = parseInt(requester[0].shelterID, 10);
  const dogshelterID = parseInt(data, 10);
  return ac
    .can(requester[0].role)
    .context({ requester: requesterID, owner: dogshelterID })
    .execute('delete')
    .sync()
    .on('dog');
};

/**
   * Method verify requester has permissions to create a dog.
   * @param {object} requester - Requester of the CRUD operation.
   * @returns {boolean} True for grant/False for deny.
   */
exports.create = (requester) => ac
  .can(requester[0].role)
  .execute('create')
  .sync()
  .on('dog');
