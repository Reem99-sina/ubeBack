const { Vonage } = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: "26e5cea4",
  apiSecret: "lHSFOmaaI2lCU6ZL"
})
 const postUser=async(req,res)=>{

}
 const sendOtp=async(req,res)=>{
    const RandomNumber=Math.ceil(Math.random()*1000)
    await vonage.sms.send({to:req.params.to, from:req.params.from, text:`${req.params.text}  ${RandomNumber}`})
    .then(resp => { res.status(200).json({message:'Message sent successfully'}) })
    .catch(err => { res.status(400).json({message:err}); });
    
}
module.exports={postUser,sendOtp}