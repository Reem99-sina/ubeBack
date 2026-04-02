const Joi = require("joi");

 const createCustomerSchema = Joi.object({
  userId: Joi.string().required(),
  email: Joi.string().email().required(),
});

 const addPaymentMethodSchema = Joi.object({
  userId: Joi.string().required().messages({
      'string.empty': 'userId is required',
      'any.required': 'userId is required',
    }),
  paymentMethodId: Joi.string().required().messages({
      'string.empty': 'paymentMethodId is required',
      'any.required': 'paymentMethodId is required',
    }),
  brand: Joi.string().required().messages({
      'string.empty': 'brand is required',
      'any.required': 'brand is required',
    }),
  last4: Joi.string().length(4).required().messages({
      'string.empty': 'last4 is required',
      'any.required': 'last4 is required',
    }),
});

module.exports={
    createCustomerSchema,
    addPaymentMethodSchema
}