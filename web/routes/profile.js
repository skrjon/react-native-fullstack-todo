import Router from 'express';

import tokens from '../db/tokens';
import { wrapAsync } from '../lib/middleware';

const router = new Router();

router.get('/', wrapAsync(async (req, res) => {
  console.log('profile', req.user);
  res.json(req.user);
}));

router.get('/logout', wrapAsync(async (req, res) => {
  await tokens.remove(req.token_id);
  // We don't need a results object because if the token doesn't exist they are logged out
  // and if it did it is now deleted
  req.logout();
  res.send('Log out successfull');
}));

module.exports = router;