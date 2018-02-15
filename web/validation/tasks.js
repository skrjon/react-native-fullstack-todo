import Joi from 'joi';

module.exports.get = {
  options: {
    allowUnknownParams: false,
  },
  params: {
    id : Joi.string().uuid().required(),
  },
};

module.exports.post = {
  body: {
    completed: Joi.boolean().required(),
  },
  options: {
    allowUnknownBody: false,
    allowUnknownParams: false,
  },
  params: {
    id : Joi.string().uuid().required(),
  },
};

module.exports.put = {
  body: {
    description: Joi.string().trim().required(),
  },
  options: {
    allowUnknownBody: false,
  },
};