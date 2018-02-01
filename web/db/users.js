import db from './';

async function create(id, google_id, name, img) {
  await db.query('INSERT INTO users (id,google_id,name,img) VALUES ($1,$2,$3,$4)', [id,google_id,name,img]);
}

async function update(id, name, img) {
  await db.query('UPDATE users SET name = $1, img = $2 WHERE id = $3', [name,img,id]);
}

async function getByUserId(user_id) {
  return await db.query('SELECT * FROM users WHERE id = $1', [user_id]);
}

async function getByGoogleId(google_id) {
  return await db.query('SELECT * FROM users WHERE google_id = $1', [google_id]);
}

module.exports = {
  create,
  getByGoogleId,
  getByUserId,
  update,
};