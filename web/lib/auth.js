import jwt from 'jsonwebtoken';
import uuid from 'uuid';
// import boom from 'boom';

import { SECRET } from '../config';
import users from '../db/users';
import tokens from '../db/tokens';

export async function googleCallback(accessToken, refreshToken, user, cb) {
  let profile = user._json;
  console.log('GoogleStrategy', profile);
  // Find or Create User in Database
  let user_id = null;
  try {
    const { rows } = await users.getByGoogleId(profile.id);
    if (rows.length < 1) {
      user_id = uuid.v4();
      console.log('creating user', user_id);
      await users.create(user_id, profile.id, profile.displayName, profile.image.url);
    } else {
      user_id = rows[0].id;
      await users.update(user_id, profile.displayName, profile.image.url);
    }
    if (!user_id) cb(null, {token: null});
  } catch (error) {
    cb(null, {token: null});
  }
  // Return User Token
  try {
    let token = await tokens.create(user_id);
    // When signing the token we need to pass in the whole object because it uses reserved attributes
    let signed_token = jwt.sign(token, SECRET);
    cb(null, {token: signed_token});
  } catch (error) {
    cb(null, {token: null});
  }
}