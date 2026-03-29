const express = require('express');
const router = express.Router();
const { validation } = require('../utils/common.validation');
const {
  createDriverValidation,
  addPaymentValidation,
  getDriverByIdValidation,
  updateDriverValidation,
  loginValidation,
} = require('../validation/driver.validation');
const {
  createDriver,
  addPaymentMethod,
  getDrivers,
  getDriverById,
  updateDriver,
  loginDriver,
  getDriver,
} = require('../service/driver/driver');
const { auth } = require('../utils/auth');

router.post('/create', validation(createDriverValidation), createDriver);
router.post('/addPayment', validation(addPaymentValidation), addPaymentMethod);
router.patch('/update', validation(updateDriverValidation), updateDriver);
router.post("/login", validation(loginValidation), loginDriver);
router.get('/', getDrivers);
router.get("/own", auth(), getDriver);

// router.get('/:id', validation(getDriverByIdValidation), getDriverById);

module.exports = router;
