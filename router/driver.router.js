const express = require('express');
const router = express.Router();
const { validation } = require('../utils/common.validation');
const {
  createDriverValidation,
  addPaymentValidation,
  getDriverByIdValidation,
} = require('../validation/driver.validation');
const {
  createDriver,
  addPaymentMethod,
  getDrivers,
  getDriverById,
} = require('../service/driver/driver');

router.post('/create', validation(createDriverValidation), createDriver);
router.post('/addPayment', validation(addPaymentValidation), addPaymentMethod);
router.get('/', getDrivers);
router.get('/:id', validation(getDriverByIdValidation), getDriverById);

module.exports = router;
