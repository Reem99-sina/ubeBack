const Joi = require("joi");

 const createCustomerSchema = Joi.object({
  userId: Joi.string().required(),
  email: Joi.string().email().required(),
});

 const addPaymentMethodSchema = Joi.object({
  userId: Joi.string().required(),
  paymentMethodId: Joi.string().required(),
  brand: Joi.string().optional(),
  last4: Joi.string().length(4).optional(),
});

module.exports={
    createCustomerSchema,
    addPaymentMethodSchema
}