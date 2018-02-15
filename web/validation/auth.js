import Joi from 'joi';

module.exports.authorization = {
  header: {
    Authorization: Joi.string().required(),
  },
  options: {
    status: 401,
    statusText: 'Authentication Required',
  },
};