import Router from 'express';
import boom from 'boom';

import tokens from '../db/tokens';
import { wrapAsync } from '../lib/middleware';

const router = new Router();

router.get('/', wrapAsync(async (req, res) => {
  console.log('profile', req.user);
  res.json(req.user);
}));

router.get('/logout', wrapAsync(async (req, res) => {
  const tr = await tokens.remove(req.token_id);
  if (tr.rowCount > 0) {
    throw boom.unauthorized('Log out successfull');
  } else {
    throw boom.badImplementation('There was a problem logging out');
  }
}));

module.exports = router;