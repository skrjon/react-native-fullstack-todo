import validate from 'express-validation';

import { requireAuth, wrapAsync } from '../lib/middleware';

import auth from './auth';
import profile from './profile';
import tasks from './tasks';
import validation from '../validation';

export function mountRoutes(app) {
  app.use('/profile', [validate(validation.auth.authorization), wrapAsync(requireAuth), profile]);
  app.use('/tasks', [validate(validation.auth.authorization), wrapAsync(requireAuth), tasks]);
  app.use('/auth', auth);
}