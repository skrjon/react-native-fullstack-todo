import Router from 'express';
import validate from 'express-validation';

import tasks from '../db/tasks';
import validation from '../validation';
import { wrapAsync } from '../lib/middleware';

const router = new Router();

router.get('/', wrapAsync(async (req, res) => {
  let all_tasks = await tasks.getAll();
  res.json(all_tasks);
}));

router.put('/', validate(validation.tasks.put), wrapAsync(async (req, res) => {
  const { description } = req.body;
  // Create a new task
  let new_task = await tasks.create(req.user.id, description);
  // Return the created task
  res.json(new_task);
}));

router.get('/:id', validate(validation.tasks.get), wrapAsync(async (req, res) => {
  const { id } = req.params;
  // Get the task
  let task = await tasks.getByTaskId(id);
  // Return the task
  res.json(task);
}));

router.post('/:id', validate(validation.tasks.post), wrapAsync(async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  // Update the task
  let updated_task = await tasks.update(id, completed);
  // Return the task
  res.json(updated_task);
}));

// export our router to be mounted by the parent application
module.exports = router;