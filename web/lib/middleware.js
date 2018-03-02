import jwt from 'jsonwebtoken';
import boom from 'boom';

import { CRYPTO } from '../config';
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
  let token = req.get('access_token');
  console.log('requireAuth', token);
  // authHeader is required
  if (token === undefined) throw boom.unauthorized('No token received');
  // If we have our authHeader then decode and pull the user id from it
  let decoded = null;
  try {
    // Instead of using headless tokens we are only allowing one algorithm for verification
    decoded = jwt.verify(token, CRYPTO.ACCESS_SECRET, { algorithms: [CRYPTO.ACCESS_ALG] });
  } catch (err) {
    // We will be removing the token and in cause there is an error we should logout the user first
    req.logout();
    // There was an error decoding the token so we must remove it
    await tokens.remove(req.token_id);
    // We don't need to send the err object to the client
    if (err.name === 'TokenExpiredError') {
      throw boom.unauthorized('Token Expired');
    }
    // Most likely this will be a JsonWebTokenError
    throw boom.unauthorized('Invalid Token');
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