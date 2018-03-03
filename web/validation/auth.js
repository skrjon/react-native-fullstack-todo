import Joi from 'joi';

module.exports.authorization = {
  headers: {
    access_token: Joi.string().required(),
  },
  options: {
    allowUnknownHeader: false,
    status: 401,
    statusText: 'Authentication Required',
  },
};

module.exports.refresh_access_token = {
  headers: {
    refresh_token: Joi.string().required(),
  },
  options: {
    allowUnknownHeader: false,
    status: 401,
    statusText: 'Authentication Required',
  },
};