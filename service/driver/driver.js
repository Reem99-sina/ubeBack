const { Driver } = require("../../module/driver");

const { Wallet } = require("../../module/wallet");

const createDriver = async (req, res) => {
  try {
    const payload = req.body;
    const existingDriver = await Driver.findOne({
      $or: [{ email: payload.email }, { phoneNumber: payload.phoneNumber }],
    });
    if (existingDriver) {
      return res.status(409).json({
        message: "Driver already exists with this email or phone number",
      });
    }
    const driver = await Driver.create(payload);

    // create a wallet for the driver
    try {
      const wallet = await Wallet.create({ driverId: driver._id, balance: 0 });
      driver.walletId = wallet._id;
      driver.walletBalance = wallet.balance;
      await driver.save();
    } catch (werr) {
      // log wallet creation error but return driver (non-fatal)
      console.warn("Failed to create wallet for driver:", werr.message);
    }

    return res.status(201).json(driver);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

const addPaymentMethod = async (req, res) => {
  try {
    const { driverId, method, creditCard, EXpDate, cvv } = req.body;
    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ message: "driver not found" });

    if (!Array.isArray(driver.paymentMethods)) driver.paymentMethods = [];

    const last4 = creditCard ? String(creditCard).slice(-4) : undefined;

    const newMethod = {
      method,
      creditCard,
      EXpDate,
      cvv,
      last4,
      createdAt: new Date(),
    };
    driver.paymentMethods.push(newMethod);

    // keep quick walletBalance/defaults intact (no wallet update here)
    await driver.save();
    return res.status(200).json({ message: "payment method added", driver });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    return res.status(200).json(drivers);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

const getDriverById = async (req, res) => {
  try {
    const { id } = req.params;
    const driver = await Driver.findById(id);
    if (!driver) return res.status(404).json({ message: "driver not found" });
    return res.status(200).json(driver);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

module.exports = { createDriver, addPaymentMethod, getDrivers, getDriverById };
