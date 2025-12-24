const express = require("express");
const router = express.Router();
const {
  createTrip,
  getTripById,
  updateTripStatus,
  confirmTripByDriver,
} = require("../service/trip/trip");
const { validation } = require("../utils/common.validation");
const {
  createTripValidation,
  updateTripStatusValidation,
  getTripByIdValidation,
} = require("../validation/trip.validation");
const { confirmTripValidation } = require("../validation/trip.validation");

router.post("/create", validation(createTripValidation), createTrip);
router.get("/:id", validation(getTripByIdValidation), getTripById);
router.patch(
  "/status",
  validation(updateTripStatusValidation),
  updateTripStatus
);
router.patch(
  "/confirm",
  validation(confirmTripValidation),
  confirmTripByDriver
);

module.exports = router;
