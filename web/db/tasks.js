import boom from 'boom';
import uuid from 'uuid';

import db from './';

async function create(user_id, description) {
  let task_id = uuid.v4();
  let insert_result = await db.query(
    'INSERT INTO tasks (id,user_id,description) VALUES ($1,$2,$3)',
    [task_id, user_id, description]
  );
  if (insert_result.rowCount === 0) throw boom.badRequest('Failed to create task');
  return await getByTaskId(task_id);
}

async function update(task_id, completed) {
  let update_result = await db.query(
    'UPDATE tasks SET completed = $1 WHERE id = $2',
    [completed, task_id]
  );
  if (update_result.rowCount === 0) throw boom.badRequest('Failed to update task', task_id);
  return await getByTaskId(task_id);
}

async function getAll() {
  let get_result = await db.query(
    'SELECT t.id,t.user_id,t.description,t.completed,u.name,u.img ' +
    'FROM tasks t LEFT OUTER JOIN users u ON (t.user_id = u.id)'
  );
  return get_result.rows;
}

async function getByTaskId(task_id) {
  let get_result = await db.query(
    'SELECT t.id,t.user_id,t.description,t.completed,u.name,u.img ' +
    'FROM tasks t LEFT OUTER JOIN users u ON (t.user_id = u.id) WHERE t.id = $1',
    [task_id]
  );
  if (get_result.rowCount === 0) throw boom.badRequest('Failed to find task', task_id);
  return get_result.rows[0];
}

async function getByUserId(user_id) {
  let get_result = await db.query(
    'SELECT t.id,t.user_id,t.description,t.completed,u.name,u.img ' +
    'FROM tasks t LEFT OUTER JOIN users u ON (t.user_id = u.id) WHERE user_id = $1',
    [user_id]
  );
  return get_result.rows;
}

module.exports = {
  create,
  getAll,
  getByTaskId,
  getByUserId,
  update,
};