import jwt from 'jsonwebtoken';
import uuid from 'uuid';
// import boom from 'boom';

import { CRYPTO } from '../config';
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
    // Access tokens are short lived so we need to shorten the expiration time for security
    let access_expires_in = 10; // For a demo app we want it real short so we can see it
    let access_token = createAccessToken(token.id, token.created, token.created + access_expires_in);
    let refresh_token = createRefreshToken(token.id, token.created, token.exp);
    // Lets return all the tokens
    cb(null, {
      access_token: access_token,
      expires_in: access_expires_in,
      refresh_token: refresh_token,
    });
  } catch (error) {
    console.error('error in token create', error);
    cb(null, {token: null});
  }
}

export function createAccessToken(token_id, created, expires) {
  return jwt.sign(
    {created: created, exp: expires, id: token_id},
    CRYPTO.ACCESS_SECRET,
    {algorithm: CRYPTO.ACCESS_ALG}
  );
}

export function createRefreshToken(token_id, created, expires) {
  return jwt.sign(
    {created: created, exp: expires, id: token_id},
    CRYPTO.REFRESH_SECRET,
    {algorithm: CRYPTO.REFRESH_ALG}
  );
}