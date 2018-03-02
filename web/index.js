import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
// import boom from 'boom';

import { googleCallback } from './lib/auth';
import { mountRoutes } from './routes';

import { googleOAuth } from './config';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';

// Initialize express server
const app = express();
// Add express plugins
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add authentication strategies
passport.use(new GoogleStrategy(googleOAuth, googleCallback));
// Initialize passport
app.use(passport.initialize());

// Mount all of our routers
mountRoutes(app);

// Default error handler
app.use((err, req, res, next) => {
  // Check if the error is server side and log those details
  if (err.isServer) {
    console.error(err);
  }
  return res.status(err.output.statusCode).json(err.output.payload);
});

app.listen(process.env.PORT || 3000);