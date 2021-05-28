const { copyFileSync, existsSync, createReadStream } = require('fs');
const { v4: uuidv4 } = require('uuid');
const mime = require('mime-types');

const upload_options = {
  multipart: true,
  formidable: {
    uploadDir: '/tmp/api/uploads',
  },
};
const fileStore = '/var/tmp/api/public/images';
const koaBody = require('koa-body')(upload_options);
const etag = require('etag');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/dogs');

const prefix = '/api/v1/dogs';
const router = Router({ prefix });
const can = require('../permissions/dogs');
const { validateDog } = require('../controllers/validation');
const JWT = require('../controllers/authJWT');

async function getById(ctx) {
  const { id } = ctx.params;
  const result = await model.getById(id);
  console.log('I HAVE THE DOG : ', result);
  if (result.length) {
    const dog = result[0];
    ctx.body = dog;
    ctx.set('Last-Modified', new Date(dog.modified).toUTCString());
    ctx.set('Etag', etag(JSON.stringify(ctx.body)));
    ctx.status = 200;
  } else {
    ctx.status = 404;
  }
}

async function searchDog(ctx) {
  const urlParams = new URLSearchParams(ctx.request.search);
  let columnFilter;
  let valueFilter;
  for (const [key, value] of urlParams) {
    columnFilter = key;
    valueFilter = value;
  }
  const result = await model.searchDog(columnFilter, valueFilter);
  if (result.length) {
    const dog = result;
    ctx.status = 201;
    ctx.body = dog;
  } else {
    ctx.status = 404;
  }
}

async function getPhoto(ctx) {
  let { page = 1, limit = 6, fields = null } = ctx.request.query;
  limit = parseInt(limit, 10);
  page = parseInt(page, 10);
  limit = limit > 100 ? 100 : limit;
  limit = limit < 1 ? 10 : limit;
  page = page < 1 ? 1 : page;
  let src;
  const result = await model.getAll(page, limit);
  console.log(result);
  if (result.length) {
    for (let i = 0; i < result.length; i++) {
      const path = `${fileStore}/${result[i].uuid}`;
      if (existsSync(path)) {
        src = createReadStream(path);
        console.log(src.path);
      }
    }
    ctx.type = 'image/jpeg';
    ctx.body = src;
    ctx.status = 201;
  }
}

async function getAll(ctx) {
  let { page = 1, limit = 6, fields = null } = ctx.request.query;
  limit = parseInt(limit, 10);
  page = parseInt(page, 10);
  limit = limit > 100 ? 100 : limit;
  limit = limit < 1 ? 10 : limit;
  page = page < 1 ? 1 : page;
  let result = await model.getAll(page, limit);
  if (result.length) {
    if (fields !== null) {
      if (Array.isArray(fields)) {
        fields = [fields];
      }
      result = result.map((record) => {
        const partial = {};
        for (const field of fields) {
          partial[field] = record[field];
          console.log(partial[field]);
        }
        return partial;
      });
    }
  }
  ctx.status = 201;
  ctx.body = result;
}

// async function getByName(ctx) {
//   const name = ctx.params.name;
//   const result = await model.getByName(name);
//   if (result.length) {
//     const dog = result
//     ctx.body = dog;
//   }
// }

async function createDog(ctx) {
  const permission = can.create(ctx.state.user);
  if (!permission.granted) {
    ctx.status = 403;
  } else {
    const workerShelterID = ctx.state.user[0].shelterID;
    const { body } = ctx.request;
    body.shelterID = workerShelterID;
    let location;
    if (workerShelterID === 1) {
      location = 'Aradippou';
    }
    if (workerShelterID === 2) {
      location = 'Nicosia';
    }
    if (workerShelterID === 3) {
      location = 'Paphos';
    }
    if (workerShelterID === 4) {
      location = 'Limassol';
    }
    body.location = location;
    const result = await model.add(body);
    if (result != null) {
      ctx.status = 201;
      ctx.body = { ID: result, created: true, link: `${ctx.request.path}${result}` };
    }
  }
}

async function createDogPOSTMAN(ctx) {
  const permission = can.create(ctx.state.user);
  if (!permission.granted) {
    ctx.status = 403;
  } else {
    		const { path, name, type } = ctx.request.files.upload;
    		const extension = mime.extension(type);
    		const imageName = uuidv4();
    		const newPath = `${fileStore}/${imageName}`;
    		copyFileSync(path, newPath);
    const workerShelterID = ctx.state.user[0].shelterID;
    const { body } = ctx.request;
    body.shelterID = workerShelterID;
    let location;
    if (workerShelterID === 1) {
      location = 'Aradippou';
    }
    if (workerShelterID === 2) {
      location = 'Nicosia';
    }
    if (workerShelterID === 3) {
      location = 'Paphos';
    }
    if (workerShelterID === 4) {
      location = 'Limassol';
    }
    body.location = location;
    body.uuid = imageName;
    const result = await model.add(body);
    if (result != null) {
      ctx.status = 201;
      ctx.body = { ID: result, created: true, link: `${ctx.request.path}${result}` };
    }
  }
}

async function updateDog(ctx) {
  const dogData = await model.getById(ctx.params.id);
  const dogShelterID = dogData[0].shelterID;
  const permission = can.update(ctx.state.user, dogShelterID);
  if (!permission.granted) {
    ctx.status = 403;
  } else {
    const { id } = ctx.params;
    let result = await model.getById(id); // check it exists
    if (result.length) {
      const dog = result[0];
      // exclude fields that should not be updated
      const { ID, ...body } = ctx.request.body;
      Object.assign(dog, body); // overwrite updatable fields with body data
      result = await model.update(dog);
      if (result) {
        ctx.status = 201;
        ctx.body = { ID: id, updated: true, link: ctx.request.path };
      } else {
        ctx.status = 404;
      }
    }
  }
}

async function deleteDog(ctx) {
  const { id } = ctx.params;
  const dogData = await model.getById(id);
  const dogShelterID = dogData[0].shelterID;
  const permission = can.delete(ctx.state.user, dogShelterID);
  if (permission.granted) {
    const result = await model.delById(id);
    if (result) {
      ctx.body = { ID: id, deleted: true };
      ctx.status = 200;
    } else {
      ctx.status = 404;
    }
  } else {
    ctx.status = 403;
  }
}

router.get('/', getAll);
router.get('/:id([0-9]{1,})', getById);
router.get('/photo', getPhoto);
router.get('/search', searchDog);
router.post('/', bodyParser(), validateDog, JWT, createDog);
router.post('/postman', bodyParser(), koaBody, validateDog, JWT, createDogPOSTMAN);
// router.get('/:name', getByName);
router.put('/:id([0-9]{1,})', JWT, bodyParser(), updateDog);
router.del('/:id([0-9]{1,})', JWT, deleteDog);

module.exports = router;
