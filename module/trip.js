const mongoose = require("mongoose");
const { Schema } = mongoose;

const geoSchema = new Schema(
  {
    lat: { type: Number },
    lng: { type: Number },
  },
  { _id: false },
);

const tripSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    driverId: { type: Schema.Types.ObjectId, ref: "Driver", required: true },
    paymentMethod: {
      method: { type: String, enum: ["card", "cash"], default: "card" },
      id: { type: String },
      brand: { type: String },
      last4: { type: String },
      isDefault: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    },
    pickup: { type: geoSchema, required: true },
    destination: { type: geoSchema, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "arrived",
        "in_progress",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = { Trip: mongoose.model("Trip", tripSchema) };
