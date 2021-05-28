const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/favourites');
const selectDog = require('../models/dogs');
const auth = require('../controllers/authJWT');

const prefix = '/api/v1/favs';
const router = Router({ prefix });
const can = require('../permissions/favourites');

async function getAll(ctx) {
  const permission = can.readAll(ctx.state.user);
  if (!permission.granted) {
    ctx.status = 403;
  } else {
    const userID = ctx.state.user;
    const result = await model.getAll(userID[0].ID);
    if (result.length) {
      const body = result.map((dogIDs) => {
        const { dogID } = dogIDs;
        return { dogID };
      });
      const allDogs = [];
      const size = result.length;
      for (let i = 0; i < size; i++) {
        const data = await model.getAllFavs(result[i].dogID);
        allDogs.push(data[0]);
      }
      ctx.status = 201;
      ctx.body = allDogs;
    } else {
      ctx.status = 404;
    }
  }
}

// async function getByIdDog(ctx) {
// try {
// const id = ctx.params.id;
// const result = await model.getByIdDog(id);
// if (result.length) {
// const fav_list = result
// ctx.status = 201;
// ctx.body = fav_list;
// }
// }catch(err){
// ctx.status = 500
// }
// }

async function getById(ctx) {
  try {
    const idDog = ctx.params.id;
    const idUser = ctx.state.user;
    const result = await model.getById(idDog, idUser[0].ID);
    if (result.length) {
      const favList = result[0];
      ctx.status = 201;
      ctx.body = favList;
    }
  } catch (err) {
    ctx.status = 404;
  }
}

async function addtoFav(ctx) {
  const { id } = ctx.params;
  const exist = await selectDog.getById(id);
  if (exist.length) {
    const body = exist[0];
    const permission = can.create(ctx.state.user);
    if (!permission.granted) {
      ctx.status = 403;
    } else {
      const result = await model.add(body, ctx.state.user);
      if (result != null) {
        ctx.status = 201;
        ctx.body = { ID: body.ID, created: true, link: `${ctx.request.path}/${result}` };
      }
    }
  } else {
    ctx.status = 404;
  }
}

async function removeFav(ctx) {
  const { id } = ctx.params;
  const result = await model.getById(id, ctx.state.user[0].ID);
  if (result.length) {
    const permission = can.delete(ctx.state.user, result[0].userID);
    if (!permission.granted) {
      ctx.status = 403;
    } else {
      const results = await model.delById(result[0].dogID, result[0].userID);
      if (results != null) {
        ctx.status = 201;
        ctx.body = { ID: id, deleted: true };
      } else {
        ctx.status = 404;
      }
    }
  }
}

router.get('/', auth, getAll);
router.get('/:id([0-9]{1,})', auth, getById);
router.post('/:id([0-9]{1,})', bodyParser(), auth, addtoFav);
router.del('/:id([0-9]{1,})', auth, removeFav);

module.exports = router;
