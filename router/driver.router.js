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
} = require('../service/driver/driver');

router.post('/create', validation(createDriverValidation), createDriver);
router.post('/addPayment', validation(addPaymentValidation), addPaymentMethod);
router.patch('/update', validation(updateDriverValidation), updateDriver);
router.post("/login", validation(loginValidation), loginDriver);
router.get('/', getDrivers);
router.get('/:id', validation(getDriverByIdValidation), getDriverById);

module.exports = router;
