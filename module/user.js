const mongoose =require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
firstName:String,
lastName:String,
email:String,
phoneNumber:String,
activeStatus:String,
role:String
})
module.exports.User = mongoose.model('user', userSchema);
