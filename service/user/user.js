const { Vonage } = require("@vonage/server-sdk");
const { User } = require("../../module/user");
const sendEmail = require("../../utils/sendEmail");

const vonage = new Vonage({
  apiKey: "26e5cea4",
  apiSecret: "lHSFOmaaI2lCU6ZL",
});
const postUser = async (req, res) => {
  const { email, name, phoneNumber } = req.body
  if(!email){
    res.status(400).json({message:"email is required"})
  }
  if(!name){
    res.status(400).json({message:"name is required"})
  }
  if(!phoneNumber){
    res.status(400).json({message:"phoneNumber is required"})
  }
  await User.create(req.body).then((result)=>res.status(200)
  .json({message:"done create user",user:result}))
  .catch((error)=>res.status(400).json({message:`error server ${error}`}))

};
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
  const UserEmail = await User.findOne({ phoneNumber: req.body.to });
  await vonage.sms
    .send({
      to: req.body.to,
      from: req.body.from,
      text: `${req.body.text}  ${RandomNumber}`,
    })
    .then((resp) => {
      console.log(resp);  
      res.status(200).json({ message: "Message sent successfully",code:RandomNumber,user:UserEmail });
    })
    .catch((err) => {
      res.status(400).json({ message: err });
    });
};
const getOtpEmail=async(req,res)=>{
    const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
    const message = `<p>the code i need is ${code}</p>`
    console.log(req.body.email,"req.body.email")
    await sendEmail(req.body.email, message)
    res.status(200).json({ message: "done" ,code:code});

}

module.exports = { postUser, sendOtp, getUser,getOtpEmail };
