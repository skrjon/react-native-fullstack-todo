import Router from 'express-promise-router';
import uuid from 'uuid';
import tasks from '../db/tasks';

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

router.get('/', async (req, res) => {
  console.log('tasks', req.user);
  const { rows } = await tasks.getAll();
  res.json(rows);
});

router.put('/', async (req, res) => {
  console.log('tasks put', req.body);
  const { description } = req.body;
  const user = req.user;
  if (user === undefined) {
    res.status(401).send('Not logged in!');
  }
  const id = uuid.v4();
  const ir = await tasks.create(id, user.id, description);
  console.log('insert rowCount', ir.rowCount);
  const { rows } = await tasks.getByTaskId(id);
  res.json(rows[0]);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await tasks.getByTaskId(id);
  res.json(rows[0]);
});

router.post('/:id', async (req, res) => {
  console.log('task completed', req.user);
  const { id } = req.params;
  const { completed } = req.body;
  if (completed === undefined) {
    res.status(500).send('Something broke!');
  } else {
    const ur = await tasks.update(id, completed);
    console.log('updated rowCount', ur.rowCount);
    const { rows } = await tasks.getByTaskId(id);
    res.json(rows[0]);
  }
});

// export our router to be mounted by the parent application
module.exports = router;