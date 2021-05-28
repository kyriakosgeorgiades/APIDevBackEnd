/**
 * A module to run JSON Schema based validation on request/response data.
 * @module controllers/validation
 * @author Kyriakos Georgiades
 * @see schemas/* for JSON Schema definition files
 */

const { Validator, ValidationError } = require('jsonschema');

const dogSchema = require('../schemas/dogs.json');
const userSchema = require('../schemas/users.json').definitions.user;

/**
 * Wrapper that returns a Koa middleware validator for a given schema.
 * @param {object} schema - The JSON schema definition of the resource
 * @param {string} resource - The name of the resource e.g. 'dog'
 * @returns {function} - A Koa middleware handler taking (ctx, next) params
 */

const checkValidator = (schema, resource) => {
  const v = new Validator();
  const validationOptions = {
    throwError: true,
    propertyName: resource,
  };

  /**
   * Koa middleware handler function to do validation
   * @param {object} ctx - The Koa request/response context object
   * @param {function} next - The Koa next callback
   * @throws {ValidationError} a jsonschema library exception
   */

  const handler = async (ctx, next) => {
    const { body } = ctx.request;

    try {
      v.validate(body, schema, validationOptions);
      await next();
    } catch (error) {
      if (error instanceof ValidationError) {
        console.error(error);
        ctx.body = error;
        ctx.status = 400;
      } else {
        throw error;
      }
    }
  };
  return handler;
};

/** Validate data against dog schema */
exports.validateDog = checkValidator(dogSchema, 'dog');
/** Validate data against user schema */
exports.validateUser = checkValidator(userSchema, 'user');
