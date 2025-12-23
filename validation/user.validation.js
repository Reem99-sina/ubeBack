const joi = require("joi");

module.exports.postUservalidation = {
  body: joi.object({
    name: joi.string().min(3).required().messages({
      "string.base": "Name must be a string",
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
      "any.required": "Name is required",
    }),

    email: joi
      .string()
      .email({ tlds: { allow: false } }) // true لو حابة تتحقق من الـ domain
      .required()
      .messages({
        "string.email": "Email must be a valid email",
        "string.empty": "Email is required",
        "any.required": "Email is required",
      }),

    phoneNumber: joi
      .string()
      .pattern(/^\+?\d{10,15}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Phone number must be valid and include country code",
        "string.empty": "Phone number is required",
        "any.required": "Phone number is required",
      }),

    role: joi
      .string()
      .valid("user", "admin", "driver") // أمثلة على الـ roles

      .messages({
        "any.only": "Role must be either 'user', 'admin', or 'driver'",
        "string.empty": "Role is required",
      }),
  }),
};

module.exports.SendOtpvalidation = {
  body: joi.object({
    to: joi
      .string()
      .pattern(/^\+?\d{10,15}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Phone number must be valid and include country code",
        "string.empty": "Phone number is required",
        "any.required": "Phone number is required",
      }),
  }),
};

module.exports.SendEmailvalidation = {
  body: joi.object({
    email: joi
      .string()
      .email({ tlds: { allow: false } }) // true لو حابة تتحقق من الـ domain
      .required()
      .messages({
        "string.email": "Email must be a valid email",
        "string.empty": "Email is required",
        "any.required": "Email is required",
      }),
  }),
};

module.exports.updateUserCreditlvalidation = {
  body: joi.object({
    email: joi
      .string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Email must be valid",
      }),

    creditCard: joi.string().creditCard().required().messages({
      "string.empty": "Credit card number is required",
      "string.creditCard": "Credit card number is invalid",
    }),

    EXpDate: joi
      .string()
      .pattern(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/) // MM/YY
      .required()
      .messages({
        "string.empty": "Expiration date is required",
        "string.pattern.base": "Expiration date must be in MM/YY format",
      }),

    cvv: joi
      .string()
      .pattern(/^[0-9]{3,4}$/) // 3 or 4 digits
      .required()
      .messages({
        "string.empty": "CVV is required",
        "string.pattern.base": "CVV must be 3 or 4 digits",
      }),
  }),
};

module.exports.updateDriverValidation = {
  body: joi.object({
    email: joi
      .string()
      .email({ tlds: { allow: false } }) // true لو حابة تتحقق من الـ domain
      .required()
      .messages({
        "string.email": "Email must be a valid email",
        "string.empty": "Email is required",
        "any.required": "Email is required",
      }),

    driver_id: joi.string().required().messages({
      "string.empty": "Driver ID is required",
      "any.required": "Driver ID is required",
    }),
  }),
};

module.exports.updateUserValidation = {
  body: joi.object({
    email: joi
      .string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Email must be valid",
      }),

    currentLocation: joi
      .object({
        lat: joi.number().required().messages({
          "number.base": "Current latitude must be a valid number",
          "any.required": "Current latitude is required",
        }),
        lng: joi.number().required().messages({
          "number.base": "Current longitude must be a valid number",
          "any.required": "Current longitude is required",
        }),
      })
      .required(),

    destination: joi
      .object({
        lat: joi.number().required().messages({
          "number.base": "Destination latitude must be a valid number",
          "any.required": "Destination latitude is required",
        }),
        lng: joi.number().required().messages({
          "number.base": "Destination longitude must be a valid number",
          "any.required": "Destination longitude is required",
        }),
      })
      .required(),

    time: joi.date().iso().required().messages({
      "date.base": "Time must be a valid ISO 8601 date-time",
      "date.format":
        "Time must be in ISO 8601 format (e.g. 2025-12-23T14:14:00.000Z)",
      "any.required": "Time is required",
    }),
  }),
};

module.exports.deleteUserValidation = {
  body: joi.object({
    email: joi
      .string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Email must be valid",
      }),
  }),
};
