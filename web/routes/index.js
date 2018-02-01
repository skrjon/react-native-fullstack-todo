import { requireAuth } from './auth';
import profile from './profile';
import tasks from './tasks';
import users from './users';

export function mountRoutes(app) {
  app.use('/profile', [requireAuth, profile]);
  app.use('/tasks', [requireAuth, tasks]);
  app.use('/users', users);
};