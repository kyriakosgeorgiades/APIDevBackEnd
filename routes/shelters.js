const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/shelters');

const router = Router({ prefix: '/api/v1/shelters' });

async function getAll(ctx) {
  const {
    page = 1, limit = 20, order = 'name', direction = 'ASC',
  } = ctx.request.query;
  const result = await model.getAll(page, limit, order, direction);
  if (result.length) {
    ctx.body = result;
  }
}

async function getByAddress(ctx) {
  const { address } = ctx.params;
  const result = await model.getByName(address);
  if (result.length) {
    const shelter = result;
    ctx.body = shelter;
  }
}

async function createShelter(ctx) {
  const { body } = ctx.request;
  const result = await model.add(body);
  if (result != null) {
    ctx.status = 201;
    ctx.body = { ID: result, created: true, link: `${ctx.request.path}${result}` };
  }
}

async function updateShelter(ctx) {
  const { id } = ctx.params;
  let result = await model.getById(id); // check it exists
  if (result.length) {
    const shelter = result[0];
    // exclude fields that should not be updated
    const { ID, ...body } = ctx.request.body;
    Object.assign(shelter, body); // overwrite updatable fields with body data
    result = await model.update(shelter);
    if (result) {
      ctx.body = { ID: id, updated: true, link: ctx.request.path };
    }
  }
}

async function deleteShelter(ctx) {
  const { id } = ctx.params;
  const result = await model.delById(id);
  if (result.affectedRows) {
    ctx.body = { ID: id, deleted: true };
  }
}

router.get('/', getAll);
router.post('/', bodyParser(), createShelter);
router.get('/:address', getByAddress);
router.put('/:id([0-9]{1,})', bodyParser(), updateShelter);
router.del('/:id([0-9]{1,})', deleteShelter);

module.exports = router;
