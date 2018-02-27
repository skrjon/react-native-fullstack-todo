import jwt from 'jsonwebtoken';
import boom from 'boom';

import { SECRET } from '../config';
import users from '../db/users';
import tokens from '../db/tokens';

export const wrapAsync = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    if (!err.isBoom) {
      return next(boom.badImplementation(err));
    }
    next(err);
  });
};

export async function requireAuth(req, res, next) {
  let token = req.get('Authorization');
  console.log('requireAuth', token);
  // authHeader is required
  if (token === undefined) throw boom.unauthorized('No token received');
  // If we have our authHeader then decode and pull the user id from it
  let decoded = null;
  try {
    decoded = jwt.verify(token, SECRET);
  } catch (err) {
    // If the token has expired we need to log the user out
    if (err.name === 'TokenExpiredError') {
      await tokens.remove(req.token_id);
      // We don't need a results object because if the token doesn't exist they are logged out
      // and if it did it is now deleted
      req.logout();
      throw boom.unauthorized('Token Expired');
    }
    throw boom.badImplementation(err);
  }
  // Get token from database
  const token_result = await tokens.getByTokenId(decoded.id);
  // If no token is found user must login again
  if (token_result.rows.length !== 1) throw boom.unauthorized('No token found');
  let token_row = token_result.rows[0];
  req.token_id = token_row.id;
  // Get user form database
  const user_result = await users.getByUserId(token_row.user_id);
  // If no user is found we have a problem, this should never happen
  if (user_result.rows.length !== 1) throw boom.badImplementation('No user associated to token found');
  // Add user to request
  req.user = user_result.rows[0];
  // Call the next middleware
  next();
}