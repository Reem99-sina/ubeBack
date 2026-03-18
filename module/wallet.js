const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema(
  {
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip' },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    note: { type: String },
  },
  { timestamps: true, _id: false }
);

const walletSchema = new Schema(
  {
    driverId: { type: Schema.Types.ObjectId, ref: 'Driver', required: true, unique: true },
    balance: { type: Number, default: 0 },
    transactions: [transactionSchema],
  },
  { timestamps: true }
);

module.exports = { Wallet: mongoose.model('Wallet', walletSchema) };
