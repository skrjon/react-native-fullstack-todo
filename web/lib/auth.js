import jwt from 'jsonwebtoken';

import { CRYPTO } from '../config';
import users from '../db/users';
import tokens from '../db/tokens';

export async function googleVerifyCallback(accessToken, refreshToken, google_profile, done) {
  console.log('GoogleStrategy', google_profile);
  let profile = google_profile._json;
  // Find or Create User in Database
  let local_user = null;
  try {
    // Check if user exists by google id
    local_user = await users.getByGoogleId(profile.id);
    try {
      // Update the detected user
      local_user = await users.update(local_user.id, refreshToken, profile.displayName, profile.image.url);
    } catch (err) {
      console.log('update-err', err);
      // We had an error updating the user
      return done(null, null, { message: 'Unable to Update User' });
    }
  } catch (err) {
    console.log('get-err', err);
    // The profile doesn't exist let create a user
    try {
      // Update the detected user
      local_user = await users.create(refreshToken, profile.id, profile.displayName, profile.image.url);
    } catch (err) {
      console.log('create-err', err);
      // We had an error creating the user
      return done(null, null, { message: 'Unable to Create User' });
    }
  }
  // Return User Token
  try {
    let token = await tokens.create(local_user.id);
    // When signing the token we need to pass in the whole object because it uses reserved attributes
    // Access tokens are short lived so we need to shorten the expiration time for security
    let access_expires_in = 10; // For a demo app we want it real short so we can see it
    let access_token = createAccessToken(token.id, token.created, token.created + access_expires_in);
    let refresh_token = createRefreshToken(token.id, token.created, token.exp);
    // Lets return all the tokens
    return done(null, {
      access_token: access_token,
      expires_in: access_expires_in,
      refresh_token: refresh_token,
    });
  } catch (error) {
    console.error('error in token create', error);
    return done(null, null, { message: 'Unable to Create Token for User' });
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