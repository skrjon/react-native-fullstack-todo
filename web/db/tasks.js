import db from './';

async function create(id, user_id, description) {
  return await db.query('INSERT INTO tasks (id,user_id,description) VALUES ($1,$2,$3)', [id, user_id, description]);
}

async function update(id, completed) {
  return await db.query('UPDATE tasks SET completed = $1 WHERE id = $2', [completed, id]);
}

async function getAll() {
  return await db.query('SELECT t.id,t.user_id,t.description,t.completed,u.name,u.img FROM tasks t LEFT OUTER JOIN users u ON (t.user_id = u.id)');
}

async function getByTaskId(task_id) {
  return await db.query('SELECT t.id,t.user_id,t.description,t.completed,u.name,u.img FROM tasks t LEFT OUTER JOIN users u ON (t.user_id = u.id) WHERE t.id = $1', [task_id]);
}

async function getByUserId(user_id) {
  return await db.query('SELECT t.id,t.user_id,t.description,t.completed,u.name,u.img FROM tasks t LEFT OUTER JOIN users u ON (t.user_id = u.id) WHERE user_id = $1', [user_id]);
}

module.exports = {
  create,
  getAll,
  getByTaskId,
  getByUserId,
  update,
};