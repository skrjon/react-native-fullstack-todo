import uuid from 'uuid';
import db from './';

async function create(user_id, platform, version) {
  let token_id = uuid.v4();
  let created = Math.floor(Date.now() / 1000);
  let token = {
    created: created,
    exp: created + 60, // Reserved attribute for JWT to set the time which the token will expire
    id: token_id,
  };
  // Create token record in db
  const tr = await db.query(
    'INSERT INTO tokens (id,user_id,created,expires,platform,version) VALUES ($1,$2,$3,$4,$5,$6)',
    [token_id, user_id, token.created, token.exp, platform, version]
  );
  if (tr.rowCount === 0) {
    throw Error('failed to create token');
  }
  return token;
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