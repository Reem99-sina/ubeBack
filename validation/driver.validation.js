const joi = require("joi");

module.exports.createDriverValidation = {
  body: joi.object({
    name: joi.string().min(2).required().messages({
      "string.empty": "name is required",
      "string.min": "name must be at least 2 characters",
    }),
    password: joi.string().min(6).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),

    email: joi
      .string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Email must be valid",
      }),
    vehicle: joi.string().optional().messages({
      "string.base": "Vehicle must be a string",
      "string.empty": "Vehicle cannot be empty",
    }),
  }),
};

module.exports.updateDriverValidation = {
  body: joi.object({
    driverId: joi.string().required().messages({
      "string.empty": "driverId is required",
    }),
    vehicle: joi.string().optional().messages({
      "string.base": "Vehicle must be a string",
      "string.empty": "Vehicle cannot be empty",
    }),
    name: joi.string().min(2).optional().messages({
      "string.base": "Name must be a string",
      "string.min": "Name must be at least 2 characters",
    }),
    paymentMethod: joi
      .object({
        method: joi.string().valid("card", "cash").required().messages({
          "any.only": "Method must be either card or cash",
          "any.required": "Payment method is required",
        }),

        creditCard: joi.when("method", {
          is: "card",
          then: joi.string().required().messages({
            "string.empty": "Credit card number is required",
          }),
          otherwise: joi.string().optional().allow(null, ""),
        }),

        EXpDate: joi.when("method", {
          is: "card",
          then: joi.string().required().messages({
            "string.empty": "Expiry date is required",
          }),
          otherwise: joi.string().optional().allow(null, ""),
        }),

        cvv: joi.when("method", {
          is: "card",
          then: joi.string().required().messages({
            "string.empty": "CVV is required",
          }),
          otherwise: joi.string().optional().allow(null, ""),
        }),
      })
      .optional(),
  }),
};

module.exports.addPaymentValidation = {
  body: joi.object({
    driverId: joi
      .string()
      .required()
      .messages({ "string.empty": "driverId is required" }),
    method: joi.string().valid("card", "cash").required(),
    creditCard: joi
      .string()
      .creditCard()
      .when("method", { is: "card", then: joi.required() }),
    EXpDate: joi
      .string()
      .pattern(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)
      .when("method", { is: "card", then: joi.required() }),
    cvv: joi
      .string()
      .pattern(/^[0-9]{3,4}$/)
      .when("method", { is: "card", then: joi.required() }),
  }),
};

module.exports.getDriverByIdValidation = {
  params: joi.object({
    id: joi
      .string()
      .required()
      .messages({ "string.empty": "driver id is required" }),
  }),
};
