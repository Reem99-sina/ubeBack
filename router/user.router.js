const {
  postUser,
  sendOtp,
  getUser,
  getOtpEmail,
  updateUser,
  getUserDriver,
  updateDriver,
  updateUserCredit,
} = require("../service/user/user");
const { validation } = require("../utils/common.validation");
const { postUservalidation, SendOtpvalidation } = require("../validation/user.validation");

const router = require("express").Router();
router.post("/", validation(postUservalidation), postUser);
router.patch("/update", updateUser);
router.patch("/updateDriver", updateDriver);
router.patch("/updateUserCredit", updateUserCredit);

router.get("/", getUser);
router.get("/driver", getUserDriver);

router.get("/OTPEmail", getOtpEmail);

router.post("/OTP", validation(SendOtpvalidation),sendOtp);

module.exports = router;
