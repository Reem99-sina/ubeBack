const { Vonage } = require("@vonage/server-sdk");
const { User } = require("../../module/user");
const sendEmail = require("../../utils/sendEmail");
const { SMS } = require("@vonage/messages");
const { default: axios } = require("axios");

const vonage = new Vonage({
  apiKey: "9430c4d3",
  apiSecret: "HP6wSNFF4UjOLu7G"
});
const postUser = async (req, res) => {
  const { email, name, phoneNumber,role } = req.body;
  if (!email) {
    res.status(400).json({ message: "email is required" });
  }
  if (!name) {
    res.status(400).json({ message: "name is required" });
  }
  if (!phoneNumber) {
    res.status(400).json({ message: "phoneNumber is required" });
  }
  await User.create(req.body)
    .then((result) =>
      res.status(200).json({ message: "done create user", user: result })
    )
    .catch((error) =>
      res.status(400).json({ message: `error server ${error}` })
    );
};
const getUser = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: "need email to fetch user" });
  } else {
    const UserEmail = await User.findOne({ email: email });
    if (UserEmail) {
      res.status(200).json(UserEmail);
    } else {
      res.status(400).json({ message: "user not found" });
    }
  }
};
const getUserDriver = async (req, res) => {
 
    const UserEmail = await User.findOne({ role: "driver" });
    if (UserEmail) {
      res.status(200).json(UserEmail);
    } else {
      res.status(400).json({ message: "user not found" });
    }
  
};
const updateDriver = async (req, res) => {
 const {email,driver_id}=req.body
  const UserEmail = await User.findOneAndUpdate({ email: email },{driver_id:driver_id});
  if (UserEmail) {
    res.status(200).json(UserEmail);
  } else {
    res.status(400).json({ message: "user not found",UserEmail });
  }

};
const sendOtp = async (req, res) => {
  const RandomNumber = Math.ceil(Math.random() * 1000);

 await axios.post("https://k2rgd3.api.infobip.com/sms/2/text/advanced",{
    messages: [
      {
          destinations: [{to:req.body.to}],
          from: "ServiceSMS",
          text: `Congratulations on sending your first message.\nGo ahead and check the delivery report in the next step ${RandomNumber}.`
      }
  ]
  },{headers:{Authorization:"App 56f0300fae690d9a005431f6228e00bf-a207de37-5f8f-47d4-8945-a994eeb6e4e9"}}).then((ressult)=> res
  .status(200)
  .json({message:ressult})).catch((error)=>res.status(200).json({ message: error }))
  // await vonage.messages.send(new SMS(
  //     `${req.body.text}  code:${RandomNumber}`,
  //      req.body.to,
  //      req.body.from
  //   ))
  //   .then((resp) => {
  //     console.log(resp,"resp");
     
  //   })
  //   .catch((err) => {
  //     res.status(400).json({ message: err })
  //   });
};
const getOtpEmail = async (req, res) => {
  const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
  const message = `<p>the code i need is ${code}</p>`;
  console.log(req.body.email, "req.body.email");
  await sendEmail(req.body.email, message);
  res.status(200).json({ message: "done", code: code });
};
const updateUser = async (req, res) => {
  const { email, currentLocation, destination, time } = req.body;
  const result=await User.findOneAndUpdate({ email: email },{currentLocation:currentLocation,destination:destination,time:time})
  if(result){
    res.status(200).json(result);
  }else{
    res.status(400).json({message:"update user error"});
  }
      
   
};

module.exports = { postUser, sendOtp, getUser, getOtpEmail, updateUser,getUserDriver,updateDriver };
