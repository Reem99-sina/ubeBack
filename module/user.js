const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: { type: String, required: true },
    activeStatus: String,
    role: { type: String, default: "user" },
    driver_id: { type: mongoose.Schema.ObjectId, ref: "user" },
    active_status: { type: Boolean, default: true },
    currentLocation: { lat: String, lng: String },
    destination: { lat: String, lng: String },
    time: String,
    creditCard: String,
    EXpDate: String,
    cvv: String,
    paymentMethods: [
      {
        method: { type: String, enum: ["card", "cash"], default: "card" },
        creditCard: String,
        EXpDate: String,
        cvv: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
 
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports.User = mongoose.model("user", userSchema);
