import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import uuid from 'uuid';

import { google, SECRET } from '../config';
import users from '../db/users';
import tokens from '../db/tokens';

async function tokenForUser(user_id, platform = '', version = '') {
  const token = await tokens.create(user_id, platform, version);
  return jwt.sign(token, SECRET);
}

export async function requireAuth(req, res, next) {
  let token = req.get('Authorization');
  console.log('requireAuth', token);
  // authHeader is required
  if (token === undefined) return res.status(401).send('No token received');
  // If we have our authHeader then decode and pull the user id from it
  try {
    let decoded = jwt.verify(token, SECRET);
    console.log('decoded', decoded);
    let token_id = decoded.id;
    // Get token from database
    const token_result = await tokens.getByTokenId(token_id);
    // If no token is found user must login again
    if (token_result.rows.length !== 1) return res.status(401).send('No token found');
    req.token = token_result.rows[0];
    // Get user form database
    const user_result = await users.getByUserId(req.token.user_id);
    // If no user is found we have a problem, this should never happen
    if (user_result.rows.length !== 1) return res.status(500).send('No user found');
    // Add user to request
    req.user = user_result.rows[0];
    next();
  } catch (err) {
    console.log('error', err);
    res.status(401).send(err.message);
  }
}

export function mountAuth(app) {
  // Register Google Passport strategy
  passport.use(new GoogleStrategy(google,
    async (accessToken, refreshToken, user, done) => {
      let profile = user._json;
      console.log('GoogleStrategy', profile);
      // Find or Create User in Database
      const { rows } = await users.getByGoogleId(profile.id);
      let user_id = null;
      if (rows.length < 1) {
        user_id = uuid.v4();
        console.log('creating user', user_id);
        await users.create(user_id, profile.id, profile.displayName, profile.image.url);
      } else {
        user_id = rows[0].id;
        await users.update(user_id, profile.displayName, profile.image.url);
      }
      // Return User Token
      let token = await tokenForUser(user_id);
      done(null, {token: token});
    }
  ));
  // Initialize passport
  app.use(passport.initialize());

  // Set up Google auth routes
  app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'], session: false })
  );
  app.get('/auth/google/logout', (req, res) => {
    req.logut();
    res.redirect('/auth/google');
  });
  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/google', session: false }),
    // this redirect will be handled in app by Linking.addEventListener
    (req, res) => res.redirect('todoapp://login?token=' + JSON.stringify(req.user.token))
  );
}