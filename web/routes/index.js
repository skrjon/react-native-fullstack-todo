import { requireAuth } from './auth';
import profile from './profile';
import tasks from './tasks';
import users from './users';
import validate from 'express-validation';
import validation from '../validation';

export function mountRoutes(app) {
  app.use('/profile', [validate(validation.auth.authorization), requireAuth, profile]);
  app.use('/tasks', [validate(validation.auth.authorization), requireAuth, tasks]);
  app.use('/users', users);
}