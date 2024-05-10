const Joi = require('joi')

const createUserSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

const updateUserSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
})

module.exports = {createUserSchema, updateUserSchema, loginSchema  }

