const mongoose =require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({

name:String,
email:{type:String, unique: true},
phoneNumber:{type:String, unique: true},
activeStatus:String,
role:{type:String,default:"user"},
driver_id:{type:mongoose.Schema.ObjectId,ref:"user"},
active_status:Boolean,
currentLocation:{lat:String,lng:String},
destination:{lat:String,lng:String},
time:String,
creditCard:String,
EXpDate:String,
cvv:String
},{timestamps:true})
module.exports.User = mongoose.model('user', userSchema);
