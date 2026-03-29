const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const driverSchema = new Schema(
  {
    name: { type: String },
    vehicle: { type: String },
    rating: { type: Number, default: 4.8 },
    active_status: { type: Boolean, default: true },
    currentLocation: { lat: String, lng: String },
    destination: { lat: String, lng: String },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    paymentMethods: [
      {
        method: { type: String, enum: ["card", "cash"], default: "card" },
        creditCard: String,
        EXpDate: String,
        cvv: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    // quick wallet reference and balance for driver
    walletId: { type: Schema.Types.ObjectId, ref: "Wallet" },
    walletBalance: { type: Number, default: 0 },
  },
  { timestamps: true },
);

driverSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
 
});

// Method to compare password
driverSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


module.exports.Driver = mongoose.model("Driver", driverSchema);
