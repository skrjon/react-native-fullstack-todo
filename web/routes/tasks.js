import Router from 'express-promise-router';
import uuid from 'uuid';
import validate from 'express-validation';
import tasks from '../db/tasks';
import validation from '../validation';

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

router.get('/', async (req, res) => {
  console.log('tasks', req.user);
  const { rows } = await tasks.getAll();
  res.json(rows);
});

router.put('/', validate(validation.tasks.put), async (req, res) => {
  console.log('tasks put', req.body);
  const { description } = req.body;
  const user = req.user;
  if (user === undefined) {
    res.status(401).send('Not logged in!');
  }
  const id = uuid.v4();
  const ir = await tasks.create(id, user.id, description);
  if (ir.rowCount === 0) {
    res.status(500).send('Failed to create task');
  }
  console.log('insert rowCount', ir.rowCount);
  const { rows } = await tasks.getByTaskId(id);
  if (rows.length === 0) {
    res.status(500).send('Failed to find created task');
  }
  res.json(rows[0]);
});

router.get('/:id', validate(validation.tasks.get), async (req, res) => {
  const { id } = req.params;
  const { rows } = await tasks.getByTaskId(id);
  if (rows.length === 0) {
    res.status(400).send('Invalid task id');
  }
  res.json(rows[0]);
});

router.post('/:id', validate(validation.tasks.post), async (req, res) => {
  console.log('task completed', req.user);
  const { id } = req.params;
  const { completed } = req.body;
  if (id === undefined || completed === undefined) {
    res.status(400).send('Invalid request');
  } else {
    const ur = await tasks.update(id, completed);
    console.log('updated rowCount', ur.rowCount);
    if (ur.rowCount === 0) {
      res.status(500).send('Failed to update task');
    }
    const { rows } = await tasks.getByTaskId(id);
    if (rows.length === 0) {
      res.status(500).send('Failed to get updated task');
    }
    res.json(rows[0]);
  }
});

// export our router to be mounted by the parent application
module.exports = router;