const mongoose =require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({

name:String,
email:{type:String, unique: true},
phoneNumber:{type:String, unique: true},
activeStatus:String,
role:String,
driver_id:{type:mongoose.Types.ObjectId,ref:"user"},
active_status:Boolean
})
module.exports.User = mongoose.model('user', userSchema);
