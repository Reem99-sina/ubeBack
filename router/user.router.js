const {
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
} = require("../service/user/user");
const { validation } = require("../utils/common.validation");
const {
  postUservalidation,
  SendOtpvalidation,
  SendEmailvalidation,
  updateUserCreditlvalidation,
  updateUserValidation,
  updateDriverValidation,
  deleteUserValidation,
} = require("../validation/user.validation");

const router = require("express").Router();
router.post("/", validation(postUservalidation), postUser);
router.get("/", GetUser);

router.patch("/update", validation(updateUserValidation), updateUser);
router.patch("/updateDriver", validation(updateDriverValidation), updateDriver);
router.patch(
  "/updateUserCredit",
  validation(updateUserCreditlvalidation),
  updateUserCredit
);

router.get("/", getUser);
router.get("/driver", getUserDriver);

router.post("/OTPEmail", validation(SendEmailvalidation), getOtpEmail);

router.post("/OTP", validation(SendOtpvalidation), sendOtp);

router.delete("/", validation(deleteUserValidation), deleteUser);

module.exports = router;
