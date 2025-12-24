const joi = require("joi");

module.exports.createDriverValidation = {
  body: joi.object({
    name: joi.string().min(2).required().messages({
      "string.empty": "name is required",
      "string.min": "name must be at least 2 characters",
    }),
    vehicle: joi.string().required().messages({
      "string.empty": "vehicle is required",
    }),
    phoneNumber: joi
      .string()
      .pattern(/^\+?\d{7,15}$/)
      .required()
      .messages({
        "string.pattern.base":
          "phoneNumber must be valid and include country code",
        "string.empty": "phoneNumber is required",
      }),
    email: joi
      .string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Email must be valid",
      }),
    paymentMethods: joi
      .array()
      .items(
        joi.object({
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
          last4: joi.string().length(4).optional(),
        })
      )
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
