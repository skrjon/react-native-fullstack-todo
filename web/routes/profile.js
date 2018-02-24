import Router from 'express-promise-router';
import tokens from '../db/tokens';

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

router.get('/', async (req, res) => {
  console.log('profile', req.user);
  res.json(req.user);
});

router.get('/logout', async (req, res) => {
  const tr = await tokens.remove(req.token.id);
  if (tr.rows > 0) {
    res.status(401).send('Logged out');
  } else {
    res.status(500).send('There was a problem logging out');
  }
});

// export our router to be mounted by the parent application
module.exports = router;