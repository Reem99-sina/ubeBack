const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userDriverSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },

    // role: "user" or "driver"
    role: { type: String, enum: ["user", "driver"], default: "user" },

    // user-specific
    driver_id: { type: Schema.Types.ObjectId, ref: "User" },
    activeStatus: { type: String },
    currentLocation: { lat: String, lng: String },
    destination: { lat: String, lng: String },
    time: { type: String },

    // driver-specific
    vehicle: { type: String },
    rating: { type: Number, default: 4.8 },
    walletId: { type: Schema.Types.ObjectId, ref: "Wallet" },
    walletBalance: { type: Number, default: 0 },
    sockets: [{ type: String }],
    // common
    active_status: { type: Boolean, default: true },
    paymentMethods: [
      {
        method: { type: String, enum: ["card", "cash"], default: "card" },
        id: { type: String },
        brand: { type: String },
        last4: { type: String },
        isDefault: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    stripeCustomerId: { type: String }, 
  },
  { timestamps: true },
);

// Hash password before save
userDriverSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userDriverSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports.User = mongoose.model("User", userDriverSchema);
