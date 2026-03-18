const express = require('express');
const router = express.Router();
const { getWalletByDriver, creditWallet, debitWallet } = require('../service/wallet/wallet');

router.get('/:driverId', getWalletByDriver);
router.post('/credit', creditWallet);
router.post('/debit', debitWallet);

module.exports = router;
