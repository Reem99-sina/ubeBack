const { postUser, sendOtp, getUser, getOtpEmail } = require("../service/user/user")

const router=require("express").Router()
router.post("/",postUser)
router.get("/",getUser)
router.get("/OTPEmail",getOtpEmail)

router.post("/OTP",sendOtp)

module.exports=router