const Router = require('express-promise-router');

const tasks = require('../db/tasks');
const users = require('../db/users');

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await users.getByUserId(id);
  res.json(rows[0]);
});

router.get('/:id/tasks', async (req, res) => {
  const { id } = req.params;
  const { rows } = await tasks.getByUserId(id);
  res.json(rows);
});

// export our router to be mounted by the parent application
module.exports = router;