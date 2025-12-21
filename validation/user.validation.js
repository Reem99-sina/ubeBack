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
      .required()
      .messages({
        "any.only": "Role must be either 'user', 'admin', or 'driver'",
        "string.empty": "Role is required",
        "any.required": "Role is required",
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