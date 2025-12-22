const { Vonage } = require("@vonage/server-sdk");
const { User } = require("../../module/user");
const sendEmail = require("../../utils/sendEmail");
const { SMS } = require("@vonage/messages");
const { default: axios } = require("axios");

const vonage = new Vonage({
  apiKey: "9430c4d3",
  apiSecret: "HP6wSNFF4UjOLu7G",
});
const GetUser = async (req, res) => {
  await User.find()
    .then((result) =>
      res.status(200).json({ message: "done create user", user: result })
    )
    .catch((error) =>
      res.status(400).json({ message: `error server ${error}` })
    );
};
const postUser = async (req, res) => {
  await User.create(req.body)
    .then((result) =>
      res.status(200).json({ message: "done create user", user: result })
    )
    .catch((error) =>
      res.status(400).json({ message: `error server ${error}` })
    );
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
  const UserEmail = await User.findOne({ role: "driver" });
  if (UserEmail) {
    res.status(200).json(UserEmail);
  } else {
    res.status(400).json({ message: "user not found" });
  }
};
const updateDriver = async (req, res) => {
  const { email, driver_id } = req.body;
  const UserEmail = await User.findOneAndUpdate(
    { email: email },
    { driver_id: driver_id }
  );
  if (UserEmail) {
    res.status(200).json(UserEmail);
  } else {
    res.status(400).json({ message: "user not found", UserEmail });
  }
};
const sendOtp = async (req, res) => {
  try {
    console.log("Request Body:", process.env.INFOBIP_API_KEY);
    const otp = Math.ceil(Math.random() * 1000);

    const user = await User.findOne({ phoneNumber: req.body.to });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found", code: otp });
    }

    // const response = await axios.post(
    //   "https://k2rgd3.api.infobip.com/whatsapp/1/message/text",
    //   {
    //     messages: [
    //       {
    //         from: "ServiceSMS",
    //         destinations: [{ to: req.body.to }],
    //         text: `Your verification code is: ${otp}`,
    //       },
    //     ],
    //   },
    //   {
    //     headers: {
    //       Authorization: `App ${process.env.INFOBIP_API_KEY}`,
    //       "Content-Type": "application/json",
    //       Accept: "application/json",
    //     },
    //   }
    // );
    await vonage.sms
      .send({
        to: req.body.to,
        from: "Vonage APIs",
        text: `Your verification code is: ${otp}`,
      })
      .then((resp) => {
        return res.status(200).json({
          success: true,
          message: "OTP sent successfully",
          code: otp,
          user: user,
        });
      })
      .catch((err) => {
        return res.status(401).json({
          success: false,
          message: "Failed to send OTP",
          code: otp,
          error: err.response?.data || err.message,
        });
      });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Failed to send OTP",
      code: otp,
      error: error.response?.data || error.message,
    });
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
  const { email, currentLocation, destination, time } = req.body;
  const result = await User.findOneAndUpdate(
    { email: email },
    { currentLocation: currentLocation, destination: destination, time: time }
  );
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(400).json({ message: "update user error" });
  }
};
const updateUserCredit = async (req, res) => {
  const { email, creditCard, EXpDate, cvv } = req.body;
  const result = await User.findOneAndUpdate(
    { email: email },
    { creditCard: creditCard, EXpDate: EXpDate, cvv: cvv }
  );
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(400).json({ message: "update user error" });
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
    return res.status(500).json({ message: "server error", error: error.message });
  }
};

module.exports = {
  postUser,
  sendOtp,
  getUser,
  getOtpEmail,
  updateUser,
  getUserDriver,
  updateDriver,
  updateUserCredit,
  deleteUser,
  GetUser,
};
