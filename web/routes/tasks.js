import Router from 'express';
import uuid from 'uuid';
import validate from 'express-validation';
import boom from 'boom';

import tasks from '../db/tasks';
import validation from '../validation';
import { wrapAsync } from '../lib/middleware';

const router = new Router();

router.get('/', wrapAsync(async (req, res) => {
  const gr = await tasks.getAll();
  res.json(gr.rows);
}));

router.put('/', validate(validation.tasks.put), wrapAsync(async (req, res) => {
  const { description } = req.body;
  const user = req.user;
  if (user === undefined) throw boom.unauthorized();
  // Create a new task
  const id = uuid.v4();
  const ir = await tasks.create(id, user.id, description);
  if (ir.rowCount === 0) throw boom.badRequest('Failed to create task');
  // Get the created task
  const gr = await tasks.getByTaskId(id);
  if (gr.rowCount === 0) throw boom.badImplementation('Failed to find created task');
  // Return the created task
  res.json(gr.rows[0]);
}));

router.get('/:id', validate(validation.tasks.get), wrapAsync(async (req, res) => {
  const { id } = req.params;
  // Get the task
  const gr = await tasks.getByTaskId(id);
  if (gr.rowCount === 0) throw boom.badRequest('Invalid task id');
  // Return the task
  res.json(gr.rows[0]);
}));

router.post('/:id', validate(validation.tasks.post), wrapAsync(async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  // Update the task
  const ur = await tasks.update(id, completed);
  if (ur.rowCount === 0) throw boom.badRequest('Failed to update task');
  // Get the udpated task
  const gr = await tasks.getByTaskId(id);
  if (gr.rowCount === 0) throw boom.badImplementation('Failed to get updated task');
  // Return the task
  res.json(gr.rows[0]);
}));

// export our router to be mounted by the parent application
module.exports = router;