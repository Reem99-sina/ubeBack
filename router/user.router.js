const { postUser, sendOtp, getUser } = require("../service/user/user")

const router=require("express").Router()
router.post("/",postUser)
router.get("/",getUser)

router.post("/OTP",sendOtp)

module.exports=router