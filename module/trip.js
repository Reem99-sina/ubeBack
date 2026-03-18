const mongoose = require('mongoose');
const { Schema } = mongoose;

const geoSchema = new Schema(
  {
    lat: { type: Number },
    lng: { type: Number },
  
  },
  { _id: false }
);

const tripSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    driverId: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
    paymentMethod: { type: String, required: true },
    pickup: { type: geoSchema, required: true },
    destination: { type: geoSchema, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'arrived', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },

  },
  { timestamps: true }
);

module.exports = { Trip: mongoose.model('Trip', tripSchema) };
