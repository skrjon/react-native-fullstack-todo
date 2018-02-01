const Router = require('express-promise-router');

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

router.get('/', async (req, res) => {
  console.log('profile', req.user);
  res.json(req.user);
});

// export our router to be mounted by the parent application
module.exports = router;