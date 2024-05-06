const { postUser, sendOtp } = require("../service/user/user")

const router=require("express").Router()
router.post("/",postUser)
router.post("/OTP",sendOtp)

module.exports=router