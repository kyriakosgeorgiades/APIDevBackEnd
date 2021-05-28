/**
 * A module for the permissions for Users.
 * @module permissions/users
 * @author Kyriakos Georgiades
 */

const AccessControl = require('role-acl');

const ac = new AccessControl();

// controls for CRUD operations on user records

/** Granting permissions for the users read their own data but excluding password */
ac
  .grant('user')
  .condition({ Fn: 'EQUALS', args: { requester: '$.owner' } })
  .execute('read')
  .on('user', ['*', '!password']);

/** Granting permissions for the workers read their own data but excluding password */
ac
  .grant('worker')
  .condition({ Fn: 'EQUALS', args: { requester: '$.owner' } })
  .execute('read')
  .on('user', ['*', '!password']);

/** Granting permissions for the users update their own data but only on specific fields */
ac
  .grant('user')
  .condition({ Fn: 'EQUALS', args: { requester: '$.owner' } })
  .execute('update')
  .on('user', ['firstName', 'lastName', 'about', 'password', 'email', 'avatarURL']);

/** Granting permissions for the workers to read all users */
ac
  .grant('worker')
  .execute('read')
  .on('users');

/**
   * Method verify requester has permissions to read all users.
   * @param {object} requester - Requester of the CRUD operation.
   * @returns {boolean} True for grant/False for deny.
   */
exports.readAll = (requester) => ac
  .can(requester[0].role)
  .execute('read')
  .sync()
  .on('users');

/**
   * Method verify requester has permissions to read their own data.
   * @param {object} requester - Requester of the CRUD operation.
   * @param {object} data - Data of the request.
   * @returns {boolean} True for grant/False for deny.
   */
exports.read = (requester, data) => ac
  .can(requester[0].role)
  .context({ requester: requester[0].ID, owner: data.ID })
  .execute('read')
  .sync()
  .on('user');

/**
   * Method verify requester has permissions to update their own data.
   * @param {object} requester - Requester of the CRUD operation.
   * @param {object} data - Data of the request.
   * @returns {boolean} True for grant/False for deny.
   */
exports.update = (requester, data) => ac
  .can(requester.role)
  .context({ requester: requester.ID, owner: data.ID })
  .execute('update')
  .sync()
  .on('user');
