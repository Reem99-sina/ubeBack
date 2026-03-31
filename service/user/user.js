const { Vonage } = require("@vonage/server-sdk");
const sendEmail = require("../../utils/sendEmail");
const { SMS } = require("@vonage/messages");
const { default: axios } = require("axios");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");
const textflow = require("textflow.js");
const { getIo, onlineDrivers } = require("../../socket");
const { Wallet } = require("../../module/wallet");
const { User } = require("../../module/user");
require("dotenv").config();
// textflow.useKey(process.env.TEXT_FLOW_KEY);
// const vonage = new Vonage({
//   apiKey: "9430c4d3",
//   apiSecret: "HP6wSNFF4UjOLu7G",
// });

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

// Temporary OTP storage (use Redis in production)
const otpStore = {};

const GetUser = async (req, res) => {
  await User.findById(req.user?._id)
    .then((result) =>
      res.status(200).json({ message: "done create user", user: result }),
    )
    .catch((error) =>
      res.status(400).json({ message: `error server ${error}` }),
    );
};
const postUser = async (req, res) => {
  try {
    // 1. Create user document
    const newUser = new User({ ...req.body });

    const savedUser = await newUser.save();

    // 2. Create wallet for user
    let wallet;
    try {
      wallet = await Wallet.create({
        driverId: savedUser._id, // link to the user
        balance: 0,
      });

      // 3. Update user with wallet info
      await User.findByIdAndUpdate(
        savedUser._id,
        { walletId: wallet._id, walletBalance: wallet.balance },
        { new: true },
      );
    } catch (walletErr) {
      // Non-fatal: wallet failed but user still created
      console.warn("Failed to create wallet for user:", walletErr.message);
    }

    // 4. Respond with created user
    return res.status(201).json({
      message: "User created successfully",
      user: savedUser,
    });
  } catch (error) {
    console.error("Failed to create user:", error.message);
    return res.status(500).json({
      message: "Server error while creating user",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
const getUser = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: "need email to fetch user" });
  } else {
    const UserEmail = await User.findOne({ email: email });
    if (UserEmail) {
      res.status(200).json(UserEmail);
    } else {
      res.status(400).json({ message: "user not found" });
    }
  }
};
const getUserDriver = async (req, res) => {
  try {
    const drivers = await User.find({ role: "driver" });
    return res.status(200).json(drivers);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};
const updateDriver = async (req, res) => {
  const { email, driver_id } = req.body;

  const io = getIo();
  const driverSocketId = onlineDrivers.get(driver_id);

  if (!driverSocketId) {
    return res.status(404).json({ message: "Driver not online" });
  }
  const UserEmail = await User.findOneAndUpdate(
    { email: email,role:"user" },
    { driver_id: driver_id },
  );

  io.to(driverSocketId).emit("rideRequest", {
    userId: UserEmail._id,
    // pickup,
    destination: UserEmail.destination,
  });

  if (UserEmail) {
    res.status(200).json(UserEmail);
  } else {
    res.status(400).json({ message: "user not found", UserEmail });
  }
};
const sendOtp = async (req, res) => {
  try {
    console.log("Request Body:", process.env.INFOBIP_API_KEY, req.body.to);
    const otp = Math.ceil(Math.random() * 1000);

    const user = await User.findOne({ phoneNumber: req.body.to });

    otpStore[req.body.to] = {
      code: otp,
      expires: Date.now() + 5 * 60 * 1000, // 5 min
    };

    await client.messages
      .create({
        body: `Your verification code is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: req.body.to,
      })
      .then(() => {
        return res.status(200).json({
          success: true,
          message: "OTP sent successfully",
          user: user,
          code: otp,
        });
      })
      .catch((err) => {
        return res.status(401).json({
          success: false,
          message: "Failed to send OTP",
          error: err.response?.data || err.message,
          user: user,
          code: otp,
        });
      });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Failed to send OTP",
      error: error.response?.data || error.message,
    });
  }
};
const sendVerifyOtp = async (req, res) => {
  try {
    const user = await User.findOne({ phoneNumber: req.body.to });
    console.log(user, "user");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found", code: otp });
    }

    const record = otpStore[phone];

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "No OTP found",
      });
    }

    if (Date.now() > record.expires) {
      delete otpStore[phone];
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (record.code != otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // ✅ success
    delete otpStore[phone];

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      user: user,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Failed to code" });
  }
};
const getOtpEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (user) {
      return res.status(404).json({ message: "the email with duplicated" });
    }

    const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    const message = `<p>the code i need is ${code}</p>`;
    console.log(req.body.email, "req.body.email");
    await sendEmail.sendEmail(req.body.email, message);
    res.status(200).json({ message: "done", code: code });
  } catch (error) {
    res.status(400).json({ message: `error server`, error });
  }
};

const updateUser = async (req, res) => {
  try {
    const {
      email,
      currentLocation,
      destination,
      time,
      vehicle,
      paymentMethod,
    } = req.body;
    const updateFields = {};
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (vehicle !== undefined) updateFields.vehicle = vehicle;
    if (currentLocation !== undefined)
      updateFields.currentLocation = currentLocation;
    if (destination !== undefined) updateFields.destination = destination;
    if (time !== undefined) updateFields.time = time;

    if (Object.keys(updateFields).length > 0) {
      await User.findOneAndUpdate({ email: email }, updateFields);
    }

    // ✅ add new payment method
    if (paymentMethod) {
      await User.findOneAndUpdate(
        { email: email },
        {
          $push: { paymentMethods: paymentMethod },
        },
      );
    }
    return res.status(200).json({ message: "user updated" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};
const updateUserCredit = async (req, res) => {
  try {
    const { email, creditCard, EXpDate, cvv } = req.body;
    if (!email) return res.status(400).json({ message: "email is required" });

    if (!creditCard || !EXpDate || !cvv)
      return res
        .status(400)
        .json({ message: "creditCard, EXpDate, and cvv are required" });

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "user not found" });

    // Ensure paymentMethods exists
    const paymentMethods = Array.isArray(user.paymentMethods)
      ? user.paymentMethods
      : [];

    // Check if card already exists
    const existingIndex = paymentMethods.findIndex(
      (m) => String(m.creditCard) === String(creditCard),
    );

    let updatedPaymentMethods;
    if (existingIndex >= 0) {
      const existing = paymentMethods[existingIndex];

      const sameCard = String(existing.creditCard) === String(creditCard);
      const sameExp = String(existing.EXpDate) === String(EXpDate);
      const sameCvv = String(existing.cvv) === String(cvv);

      if (sameCard && sameExp && sameCvv) {
        // No changes, just update top-level fields
        await User.updateOne({ email }, { creditCard, EXpDate, cvv });
        return res
          .status(200)
          .json({ message: "payment details are the same", user });
      }

      // Partial update
      existing.EXpDate = EXpDate;
      existing.cvv = cvv;
      existing.last4 = String(creditCard).slice(-4);
      paymentMethods[existingIndex] = existing;

      updatedPaymentMethods = paymentMethods;
    } else {
      // New card
      const newMethod = {
        method: "card",
        creditCard,
        EXpDate,
        cvv,
        last4: String(creditCard).slice(-4),
        createdAt: new Date(),
      };
      updatedPaymentMethods = [...paymentMethods, newMethod];
    }

    // Update user document in one operation
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        creditCard,
        EXpDate,
        cvv,
        paymentMethods: updatedPaymentMethods,
      },
      { new: true }, // Return updated document
    );

    return res.status(200).json({
      message:
        existingIndex >= 0 ? "payment method updated" : "payment method added",
      user: updatedUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }
    const deleted = await User.findOneAndDelete({ email: email });
    if (deleted) {
      return res.status(200).json({ message: "user deleted", user: deleted });
    } else {
      return res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

module.exports = {
  postUser,
  loginUser,
  sendOtp,
  getUser,
  getOtpEmail,
  updateUser,
  getUserDriver,
  updateDriver,
  updateUserCredit,
  deleteUser,
  GetUser,
  sendVerifyOtp,
};
