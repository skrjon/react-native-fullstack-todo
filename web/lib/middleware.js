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
  let decoded = jwt.verify(token, SECRET);
  // Get token from database
  const token_result = await tokens.getByTokenId(decoded);
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