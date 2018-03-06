import boom from 'boom';
import uuid from 'uuid';
import db from './';

async function create(user_id) {
  let token_id = uuid.v4();
  let created = Math.floor(Date.now() / 1000);
  let token = {
    created: created,
    exp: created + (60 * 60 * 24 * 45), // JWT Reserved attribute for the epoch time which the token will expire
    id: token_id,
  };
  // Create token record in db
  let tr = await db.query(
    'INSERT INTO tokens (id,user_id,created,expires) VALUES ($1,$2,$3,$4)',
    [token_id, user_id, token.created, token.exp]
  );
  if (tr.rowCount === 0) throw boom.badRequest('failed to create token');
  // We don't need to get the inserted token from the db we can trust the insert worked
  return token;
}

async function getByTokenId(token_id) {
  let tr = await db.query(
    'SELECT * FROM tokens WHERE id = $1',
    [token_id]
  );
  if (tr.rowCount === 0) throw boom.badRequest('Failed to get token', token_id);
  return tr.rows[0];
}

async function getByUserId(user_id) {
  let tr = await db.query(
    'SELECT * FROM tokens WHERE user_id = $1',
    [user_id]
  );
  if (tr.rowCount === 0) throw boom.badRequest('Failed to get users tokens', user_id);
  return tr.rows;
}

async function remove(token_id) {
  let tr = await db.query(
    'DELETE FROM tokens WHERE id = $1',
    [token_id]
  );
  if (tr.rowCount === 0) throw boom.badRequest('failed to remove token', token_id);
  return true;
}

module.exports = {
  create,
  getByTokenId,
  getByUserId,
  remove,
};