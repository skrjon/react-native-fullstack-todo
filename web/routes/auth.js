import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import Router from 'express-promise-router';
import jwt from 'jsonwebtoken';
import uuid from 'uuid';

import { google, SECRET } from '../config';
import users from '../db/users';

export function tokenForUser (id) {
  let obj = {
    created: Date.now(),
    id: id,
  };
  return jwt.sign(obj, SECRET, {expiresIn: 15});

}

export async function requireAuth(req, res, next) {
  let token = req.get('Authorization');
  console.log('requireAuth', token);
  // authHeader is required
  if(token === undefined) res.status(401).send('No token received');
  // If we have our authHeader then decode and pull the user id from it
  try {
    let decoded = jwt.verify(token, SECRET);
    console.log('decoded', decoded);
    let user_id = decoded.id;
    // Get user from database
    const { rows } = await users.getByUserId(user_id);
    if (rows.length !== 1) return next(res.status(400).send('No user found'));
    // Add user to request
    req.user = rows[0];
    next();
  } catch(err) {
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
      let id = null;
      if (rows.length < 1) {
        id = uuid.v4();
        console.log('creating user', id);
        await users.create(id, profile.id, profile.displayName, profile.image.url);
      } else {
        id = rows[0].id;
        await users.update(id, profile.displayName, profile.image.url);
      }
      // Return User Token
      done(null, {token:tokenForUser(id)});
    }
  ));
  // Serialize user into the sessions
  passport.serializeUser((user, done) => done(null, user));
  // Deserialize user from the sessions
  passport.deserializeUser((user, done) => done(null, user));

  app.use(passport.initialize());
  app.use(passport.session());

  // Set up Google auth routes
  app.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile'] })
  );
  app.get('/auth/google/logout', (req, res) => {
    req.logut();
    res.redirect('/auth/google');
  });
  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/google' }),
    // this redirect will be handled in app by Linking.addEventListener
    (req, res) => res.redirect('todoapp://login?token=' + JSON.stringify(req.user.token))
  );
};
