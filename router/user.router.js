const { postUser, sendOtp, getUser, getOtpEmail, updateUser } = require("../service/user/user")

const router=require("express").Router()
router.post("/",postUser)
router.patch("/:email",updateUser)

router.get("/",getUser)
router.get("/OTPEmail",getOtpEmail)

router.post("/OTP",sendOtp)

module.exports=router