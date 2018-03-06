import boom from 'boom';
import uuid from 'uuid';
// import bcrypt from 'bcrypt';
// import crypto from 'crypto';

// import { REFRESH } from '../config';
import db from './';

// function encryptToken(token) {
//   let iv = crypto.randomBytes(REFRESH.IV_LENGTH);
//   let cipher = crypto.createCipheriv(REFRESH.ALGORITHM, new Buffer(REFRESH.ENCRYPTION_KEY), iv);
//   let encrypted = cipher.update(token);
//   encrypted = Buffer.concat([encrypted, cipher.final()]);
//   return iv.toString('hex') + ':' + encrypted.toString('hex');
// }

// function decryptToken(token) {
//   let textParts = token.split(':');
//   let iv = new Buffer(textParts.shift(), 'hex');
//   let encryptedText = new Buffer(textParts.join(':'), 'hex');
//   let decipher = crypto.createDecipheriv(REFRESH.ALGORITHM, new Buffer(REFRESH.ENCRYPTION_KEY), iv);
//   let decrypted = decipher.update(encryptedText);
//   decrypted = Buffer.concat([decrypted, decipher.final()]);
//   return decrypted.toString();
// }

// async function encryptPassword(password) {
//   return await bcrypt.hash(password, 10);
// }

// async function comparePassword(password, hash) {
//   return await bcrypt.compare(password, hash);
// }

async function create(refresh_token, google_id, name, img_url) {
  let user_id = uuid.v4();
  let create_result = await db.query(
    'INSERT INTO users (id,refresh_token,google_id,name,img) VALUES ($1,$2,$3,$4,$5)',
    [user_id, refresh_token, google_id, name, img_url]
  );
  if (create_result.rowCount === 0) throw boom.badRequest('Failed to create user');
  return await getByUserId(user_id);
}

async function update(id, refresh_token, name, img_url) {
  let update_result = await db.query(
    'UPDATE users SET name = $1, img = $2, refresh_token = $3 WHERE id = $4',
    [name, img_url, refresh_token, id]
  );
  if (update_result.rowCount === 0) throw boom.badRequest('Failed to update user', id);
  return await getByUserId(id);
}

async function getByUserId(user_id) {
  let get_result = await db.query(
    'SELECT * FROM users WHERE id = $1',
    [user_id]
  );
  if (get_result.rowCount === 0) throw boom.badRequest('Failed to find user', user_id);
  return get_result.rows[0];
}

async function getByGoogleId(google_id) {
  let get_result = await db.query(
    'SELECT * FROM users WHERE google_id = $1',
    [google_id]
  );
  if (get_result.rowCount === 0) throw boom.badRequest('Failed to find google_id', google_id);
  return get_result.rows[0];
}

module.exports = {
  create,
  getByGoogleId,
  getByUserId,
  update,
};