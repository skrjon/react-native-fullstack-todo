import Router from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import boom from 'boom';

import { CRYPTO } from '../config';
import { wrapAsync } from '../lib/middleware';
import { createAccessToken } from '../lib/auth';
import tokens from '../db/tokens';

export const router = new Router();

router.get('/token', wrapAsync(async (req, res) => {
  let refresh_token = req.get('refresh_token');
  console.log('refresh_token', refresh_token);
  // authHeader is required
  if (refresh_token === undefined) throw boom.unauthorized('No token received');
  // If we have our authHeader then decode and pull the user id from it
  let decoded = null;
  try {
    // Instead of using headless tokens we are only allowing one algorithm for verification
    decoded = jwt.verify(refresh_token, CRYPTO.REFRESH_SECRET, { algorithms: [CRYPTO.REFRESH_ALG] });
  } catch (err) {
    // We will be removing the token and in cause there is an error we should logout the user first
    req.logout();
    // There was an error decoding the token so we must remove it
    await tokens.remove(req.token_id);
    // We don't need to send the err object to the client
    if (err.name === 'TokenExpiredError') {
      throw boom.unauthorized('Token Expired');
    }
    // Most likely this will be a JsonWebTokenError
    throw boom.unauthorized('Invalid Token');
  }
  // Get token from database
  const token_result = await tokens.getByTokenId(decoded.id);
  // If no token is found user must login again
  if (token_result.rows.length !== 1) {
    req.logout();
    throw boom.unauthorized('No token found');
  }
  let token_row = token_result.rows[0];
  // Create new Access Token
  let created = Math.floor(Date.now() / 1000);
  let access_expires_in = 10; // For a demo app we want it real short so we can see it
  let access_token = createAccessToken(token_row.id, created, created + access_expires_in);
  // Lets return all the tokens
  res.json({
    access_token: access_token,
    expires_in: access_expires_in,
  });
}));

router.get('/google',
  passport.authenticate('google', {
    prompt: 'select_account',
    scope: ['profile'],
    session: false,
  })
);

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/google',
    session: false,
  }),
  // this redirect will be handled in app by Linking.addEventListener
  (req, res) => res.redirect('todoapp://login?token=' + JSON.stringify(req.user))
);

module.exports = router;