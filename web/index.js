import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
// import boom from 'boom';
import ev from 'express-validation';

import { googleVerifyCallback } from './lib/auth';
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
passport.use(new GoogleStrategy(googleOAuth, googleVerifyCallback));
// Initialize passport
app.use(passport.initialize());

// Mount all of our routers
mountRoutes(app);

// Default error handler
app.use((err, req, res, next) => {
  // Check if the error is server side and log those details
  console.log(err);
  // Convert Validation Error to match Boom Syntax
  if (err instanceof ev.ValidationError) {
    return res.status(err.status).json({
      error: 'Validation',
      errors: err.errors,
      message: err.statusText,
      statusCode: err.status,
    });
  } else if (err.isBoom) {
    if (err.isServer) {
      console.error(err);
    }
    return res.status(err.output.statusCode).json(err.output.payload);
  }
  // This is an unkonwn and shouldn't happen
  console.error('UNKNOWN ERROR', err);
  res.status(500).json(err);
});

app.listen(process.env.PORT || 3000);