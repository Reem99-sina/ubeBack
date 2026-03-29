const { Driver } = require("../../module/driver");

const { Wallet } = require("../../module/wallet");
const jwt = require("jsonwebtoken");

const createDriver = async (req, res) => {
  try {
    const payload = req.body;
    const existingDriver = await Driver.findOne({
      $or: [{ email: payload.email }],
    });
    if (existingDriver) {
      return res.status(409).json({
        message: "Driver already exists with this email or phone number",
      });
    }
    const driver = new Driver(payload);
    await driver.save();

    // // create a wallet for the driver
    

    return res.status(201).json(driver);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

const loginDriver = async (req, res) => {
  try {
    const { email, password } = req.body;

    const driver = await Driver.findOne({ email });

    if (!driver) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await driver.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ driverId: driver._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
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

const updateDriver = async (req, res) => {
  try {
    const { driverId, vehicle, paymentMethod } = req.body;

    const updateFields = {};

    if (vehicle !== undefined) updateFields.vehicle = vehicle;

    if (Object.keys(updateFields).length > 0) {
      await Driver.findByIdAndUpdate(driverId, updateFields);
    }

    // ✅ add new payment method
    if (paymentMethod) {
      await Driver.findByIdAndUpdate(driverId, {
        $push: { paymentMethods: paymentMethod },
      });
    }

    const driver = await Driver.findById(driverId);

    return res.status(200).json({ message: "driver updated", driver });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

const getDriver = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: "need email to fetch driver" });
  } else {
    const DriverEmail = await Driver.findOne({ email: email });
    if (DriverEmail) {
      res.status(200).json(DriverEmail);
    } else {
      res.status(400).json({ message: "driver not found" });
    }
  }
};

module.exports = {
  createDriver,
  addPaymentMethod,
  getDrivers,
  getDriverById,
  updateDriver,
  loginDriver,
  getDriver
};
