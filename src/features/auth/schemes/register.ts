import Joi, { ObjectSchema } from 'joi';

const registerSchema: ObjectSchema = Joi.object().keys({
  username: Joi.string().required().min(8).max(20).messages({
    'string.base': 'Username must be of type string',
    'string.min': 'username must be at least 8 characters',
    'string.max': 'username must be between 8 and 20 long characters',
    'string.empty': 'Username is a required field'
  }),
  password: Joi.string().required().min(8).max(16).messages({
    'string.base': 'Password must be of type string',
    'string.min': 'Password must be at least 8 characters',
    'string.max': 'Password must be between 8 and 16 characters long',
    'string.empty': 'Password is a required field'
  }),
  email: Joi.string().required().email().messages({
    'string.base': 'Email must be of type string',
    'string.email': 'Email must be valid',
    'string.empty': 'Email is a required field'
  }),
  avatarColor: Joi.string().required().messages({
    'any.required': 'Avatar color is required'
  }),
  avatarImage: Joi.string().required().messages({
    'any.required': 'Avatar image is required'
  })
});

export { registerSchema };
