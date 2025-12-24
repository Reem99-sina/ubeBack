const mongoose = require("mongoose");
const { Schema } = mongoose;

const driverSchema = new Schema(
  {
    name: { type: String },
    vehicle: { type: String },
    rating: { type: Number, default: 4.8 },
    active_status: { type: Boolean, default: false },
    currentLocation: { lat: String, lng: String },
    destination: { lat: String, lng: String },
    email: { type: String, unique: true },
    phoneNumber: { type: String, unique: true },
    // multiple payment methods for driver (cards / cash)
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
  { timestamps: true }
);

module.exports.Driver = mongoose.model("Driver", driverSchema);
