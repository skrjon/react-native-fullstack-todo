import db from './';

async function create(id, user_id, created, expires, platform, version) {
  return await db.query(
    'INSERT INTO tokens (id,user_id,created,expires,platform,version) VALUES ($1,$2,$3,$4,$5,$6)',
    [id, user_id, created, expires, platform, version]
  );
}

async function getByTokenId(token_id) {
  return await db.query(
    'SELECT * FROM tokens WHERE id = $1',
    [token_id]
  );
}

async function getByUserId(user_id) {
  return await db.query(
    'SELECT * FROM tokens WHERE user_id = $1',
    [user_id]
  );
}

async function remove(token_id) {
  return await db.query(
    'DELETE FROM tokens WHERE id = $1',
    [token_id]
  );
}

module.exports = {
  create,
  getByTokenId,
  getByUserId,
  remove,
};