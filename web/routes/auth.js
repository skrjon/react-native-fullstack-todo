import Router from 'express';
import passport from 'passport';
import validate from 'express-validation';
import jwt from 'jsonwebtoken';
import boom from 'boom';

import { CRYPTO } from '../config';
import { wrapAsync } from '../lib/middleware';
import { createAccessToken } from '../lib/auth';
import validation from '../validation';
import tokens from '../db/tokens';

export const router = new Router();

router.get('/token', validate(validation.auth.refresh_access_token), wrapAsync(async (req, res) => {
  let refresh_token = req.get('refresh_token');
  console.log('refresh_token', refresh_token);
  // authHeader is required
  if (refresh_token === undefined) throw boom.unauthorized('No token received');
  // If we have our refresh_token then decode and pull the user id from it
  let decoded = null;
  try {
    // Instead of using headless tokens we are only allowing one algorithm for verification
    decoded = jwt.verify(refresh_token, CRYPTO.REFRESH_SECRET, { algorithms: [CRYPTO.REFRESH_ALG] });
  } catch (err) {
    // We will be removing the token and in cause there is an error we should logout the user first
    req.logout();
    // There was an error decoding the token so we must remove it
    try {
      await tokens.remove(req.token.id);
    } catch (err) {
      // If we have an error removing the token its no longer valid and they need to logout
      throw boom.unauthorized('Invalid Token');
    }
    // We don't need to send the err object to the client
    if (err.name === 'TokenExpiredError') {
      throw boom.unauthorized('Token Expired');
    }
    // Most likely this will be a JsonWebTokenError
    throw boom.unauthorized('Invalid Token');
  }
  // Get token from database
  let token = null;
  try {
    token = await tokens.getByTokenId(decoded.id);
  } catch (err) {
    // If no token is found user must login again
    req.logout();
    throw boom.unauthorized('No token found');
  }
  // Create new Access Token
  let created = Math.floor(Date.now() / 1000);
  let access_expires_in = 10; // For a demo app we want it real short so we can see it
  let access_token = createAccessToken(token.id, created, created + access_expires_in);
  // Lets return all the tokens
  res.json({
    access_token: access_token,
    expires_in: access_expires_in,
  });
}));

router.get('/google',
  (req, res, next) => {
    console.log('/GOOGLE CALLED');
    next();
  },
  passport.authenticate('google', {
    prompt: 'select_account',
    scope: ['profile'],
    session: false,
  })
);

router.get('/google/callback',
  (req, res, next) => {
    console.log('/GOOGLE/CALLBACK CALLED');
    passport.authenticate('google', (err, user, info) => {
      console.log('CUSTOM CALLBACK', err, user, info);
      if (err) {
        return next(err);
      } else if (!user && info) {
        // redirect with info
        console.log('redirect with info', info);
        return res.redirect('todoapp://login?info=' + JSON.stringify(info));
      } else if (user) {
        // redirect with token
        console.log('redirect with user', user);
        return res.redirect('todoapp://login?token=' + JSON.stringify(user));
      }
      if (!user) return res.redirect('/auth/google');
      console.log('WHY AM I HERE?');
    })(req, res, next);
  },
);

module.exports = router;