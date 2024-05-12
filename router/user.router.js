const { postUser, sendOtp, getUser, getOtpEmail, updateUser, getUserDriver, updateDriver } = require("../service/user/user")

const router=require("express").Router()
router.post("/",postUser)
router.patch("/update",updateUser)
router.patch("/updateDriver",updateDriver)

router.get("/",getUser)
router.get("/driver",getUserDriver)

router.get("/OTPEmail",getOtpEmail)

router.post("/OTP",sendOtp)

module.exports=router