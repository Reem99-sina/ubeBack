const { Vonage } = require("@vonage/server-sdk");
const { User } = require("../../module/user");

const vonage = new Vonage({
  apiKey: "26e5cea4",
  apiSecret: "lHSFOmaaI2lCU6ZL",
});
const postUser = async (req, res) => {};
const getUser = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({message:"need email to fetch user"});
  } else {
    const UserEmail = await User.findOne({ email: email });
    if (UserEmail) {
      res.status(200).json(UserEmail);
    } else {
      res.status(400).json({message:"user not found"});
    }
  }
};
const sendOtp = async (req, res) => {
  const RandomNumber = Math.ceil(Math.random() * 1000);
  await vonage.sms
    .send({
      to: req.body.to,
      from: req.body.from,
      text: `${req.body.text}  ${RandomNumber}`,
    })
    .then((resp) => {
      res.status(200).json({ message: "Message sent successfully",code:RandomNumber });
    })
    .catch((err) => {
      res.status(400).json({ message: err });
    });
};
module.exports = { postUser, sendOtp, getUser };
