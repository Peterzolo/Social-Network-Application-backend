import Joi, { ObjectSchema } from 'joi';

const emailSchema: ObjectSchema = Joi.object().keys({
  email: Joi.string().email().required().messages({
    'string.base': 'Field must be valid',
    'string.required': 'Field must be valid',
    'string.email': 'Field must be valid'
  })
});

const passwordSchema: ObjectSchema = Joi.object().keys({
  password: Joi.string().required().min(8).max(16).messages({
    'string.base': 'Password must be of type string',
    'string.min': 'Password must be at least 8 characters',
    'string.max': 'Password must be between 8 and 16 characters long',
    'string.empty': 'Password is a required field'
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.only': 'Passwords should match',
    'any.required': 'Confirm password is a required field'
  })
});

export { emailSchema, passwordSchema };
