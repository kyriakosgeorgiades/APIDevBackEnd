const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/users');
const auth = require('../controllers/auth');
const JWT = require('../controllers/authJWT');
const can = require('../permissions/users');

const prefix = '/api/v1/users';
const router = Router({ prefix });
const { validateUser } = require('../controllers/validation');
const issueJwt = require('../helpers/issueJwt');

async function loginUser(ctx) {
  try {
    const {
      ID, username, role, email, avatarURL,
    } = ctx.state.user;
    const user = await model.getById(ID);
    const jwt = issueJwt.issueJWT(user);
    const links = {
      self: `${ctx.protocol}://${ctx.host}${prefix}/${ID}`,
    };
    ctx.body = {
      ID, username, role, email, avatarURL, links, token: jwt.token, expiresIn: jwt.expires, log: true,
    };
    ctx.status = 200;
  } catch (err) {
    console.log(`error ${err.message}`);
    ctx.throw(500, 'failed login', { message: err.message });
  }
}

async function getAll(ctx) {
  const permission = can.readAll(ctx.state.user);
  if (!permission.granted) {
    ctx.status = 403;
  } else {
    const result = await model.getAll(1, 10, 'ASC');
    if (result.length) {
      ctx.status = 201;
      ctx.body = result;
    }
  }
}
async function getById(ctx) {
  try {
    const { id } = ctx.params;
    const result = await model.getById(id);
    if (result.length) {
      const permission = can.read(ctx.state.user, result[0]);
      if (!permission.granted) {
        ctx.status = 403;
      } else {
        ctx.status = 200;
        const user = result[0];
        ctx.body = user;
      }
    }
  } catch (err) {
    console.log(`error ${err.message}`);
    ctx.throw(500, 'user data error', { message: err.message });
  }
}

async function createUser(ctx) {
  const { body } = ctx.request;
  const result = await model.add(body);
  if (result != null) {
    ctx.status = 201;
    const user = await model.getById(result[0]);
    const jwt = issueJwt.issueJWT(user);
    ctx.body = {
      ID: result, created: true, role: user[0].role, link: `${ctx.request.path}${result}`, token: jwt.token, expiresIn: jwt.expires,
    };
  }
}

async function updateUser(ctx) {
  const { id } = ctx.params;
  let result = await model.getById(id); // check it exists
  if (result.length) {
    const user = result[0];
    const { ID, dateRegistered, ...body } = ctx.request.body;
    Object.assign(user, body); // overwrite updatable fields with body data
    result = await model.update(user);
    if (result) {
      ctx.status = 201;
      ctx.body = { ID: id, updated: true, link: ctx.request.path };
    }
  }
}

async function deleteUser(ctx) {
  const { id } = ctx.params;
  const result = await model.delById(id);
  if (result === 1) {
    ctx.status = 200;
    ctx.body = { ID: id, deleted: true };
  }
}

router.get('/', JWT, getAll);
router.post('/', bodyParser(), validateUser, createUser);
router.get('/:id([0-9]{1,})', JWT, getById);
router.put('/:id([0-9]{1,})', JWT, bodyParser(), updateUser);
router.del('/:id([0-9]{1,})', JWT, deleteUser);
router.post('/login', auth, loginUser);

module.exports = router;
