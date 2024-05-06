const { postUser, sendOtp } = require("../service/user/user")

const router=require("express").Router()
router.post("/",postUser)
router.get("/OTP",sendOtp)

module.exports=router