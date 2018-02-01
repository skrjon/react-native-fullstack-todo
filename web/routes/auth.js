import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import Router from 'express-promise-router';
import jwt from 'jwt-simple';
import uuid from 'uuid';

import { google, SECRET } from '../config';
import users from '../db/users';

export function tokenForUser (id) {
  let obj = {
    iat: new Date().getTime(),
    id: id,
  };
  return jwt.encode(obj, SECRET);
}

export async function requireAuth(req, res, next) {
  let authHeader = req.get('Authorization');
  console.log('requireAuth', authHeader);
  // authHeader is required
  if(authHeader === undefined) return next(res.send(401));
  // If we have our authHeader then decode and pull the user id from it
  let jwtToken = jwt.decode(authHeader, SECRET);
  let user_id = jwtToken.id;
  // Get user from database
  const { rows } = await users.getByUserId(user_id);
  if (rows.length !== 1) return next(res.send(400, "No user found"));
  // Add user to request
  req.user = rows[0];
  next();
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
