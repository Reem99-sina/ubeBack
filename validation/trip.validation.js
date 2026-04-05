const joi = require("joi");

module.exports.createTripValidation = {
  body: joi.object({
    userId: joi.string().required().messages({
      "string.empty": "userId is required",
      "any.required": "userId is required",
    }),
    driverId: joi.string().required().messages({
      "string.empty": "driverId is required",
      "any.required": "driverId is required",
    }),
    paymentMethod: joi
      .object({
        method: joi.string().valid("cash", "card").required().messages({
          "string.empty": "paymentMethod.method is required",
          "any.only": "paymentMethod.method must be either 'cash' or 'card'",
          "any.required": "paymentMethod.method is required",
        }),
        id: joi.string().when("method", {
          is: "card",
          then: joi.required().messages({
            "any.required": "paymentMethod.id is required for card",
          }),
          otherwise: joi.optional(),
        }),
        brand: joi.string().optional(),
        last4: joi.string().optional(),
        isDefault: joi.boolean().optional(),
        createdAt: joi.string().optional(),

      })
      .required()
      .messages({
        "any.required": "paymentMethod is required",
      }),
  }),
};

module.exports.updateTripStatusValidation = {
  body: joi.object({
    tripId: joi.string().required().messages({
      "string.empty": "tripId is required",
      "any.required": "tripId is required",
    }),
    status: joi
      .string()
      .valid(
        "pending",
        "accepted",
        "arrived",
        "in_progress",
        "completed",
        "cancelled",
      )
      .required()
      .messages({
        "any.only": "status must be a valid trip status",
        "any.required": "status is required",
      }),
  }),
};

module.exports.getTripByIdValidation = {
  params: joi.object({
    id: joi.string().required().messages({
      "string.empty": "trip id is required",
      "any.required": "trip id is required",
    }),
  }),
};

module.exports.confirmTripValidation = {
  body: joi.object({
    tripId: joi.string().required().messages({
      "string.empty": "tripId is required",
      "any.required": "tripId is required",
    }),
    driverId: joi.string().required().messages({
      "string.empty": "driverId is required",
      "any.required": "driverId is required",
    }),
  }),
};
