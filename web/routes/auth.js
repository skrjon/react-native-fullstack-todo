import Router from 'express';
import passport from 'passport';

export const router = new Router();

router.get('/google',
  passport.authenticate('google', {
    prompt: 'select_account',
    scope: ['profile'],
    session: false,
  })
);

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/google',
    session: false,
  }),
  // this redirect will be handled in app by Linking.addEventListener
  (req, res) => res.redirect('todoapp://login?token=' + JSON.stringify(req.user))
);

module.exports = router;