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
  // If we have our access_token then decode and pull the user id from it
  let decoded = null;
  try {
    // Instead of using headless tokens we are only allowing one algorithm for verification
    decoded = jwt.verify(token, CRYPTO.ACCESS_SECRET, { algorithms: [CRYPTO.ACCESS_ALG] });
  } catch (err) {
    // We will need to log the user out
    // Since this is only the access_token being rejected we don't need to remove the token from the database
    req.logout();
    // We don't need to send the err object to the client
    if (err.name === 'TokenExpiredError') {
      throw boom.unauthorized('Token Expired');
    }
    // Most likely this will be a JsonWebTokenError
    throw boom.unauthorized('Invalid Token');
  }
  // Get token from database
  try {
    req.token = await tokens.getByTokenId(decoded.id);
  } catch (err) {
    // If no token is found user must login again
    req.logout();
    throw boom.unauthorized('No token found', decoded.id);
  }
  // Get user form database
  try {
    // Add user to request
    req.user = await users.getByUserId(req.token.user_id);
  } catch (err) {
    // If no user is found we have a problem, this should never happen
    req.logout();
    throw boom.badImplementation('No user associated to token found');
  }
  // Call the next middleware
  next();
}