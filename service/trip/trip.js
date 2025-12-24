const { Trip } = require("../../module/trip");
const { User } = require("../../module/user");
const { Driver } = require("../../module/driver");

const createTrip = async (req, res) => {
  try {
    const { userId, driverId, paymentMethod } = req.body;
    if (!userId || !driverId || !paymentMethod) {
      return res.status(400).json({ message: "missing required fields" });
    }
    const user = await User.findById(userId);

    // If paymentMethod is 'card' ensure the user has a saved card
    if (paymentMethod === "card") {
      if (!user) return res.status(404).json({ message: "user not found" });
      if (!user.creditCard) {
        return res.status(400).json({
          message:
            "no saved card for this user, please add a card or choose cash",
        });
      }
    }

    // ensure driver exists (now a separate collection)
    const driverExists = await Driver.findById(driverId);
    if (!driverExists) return res.status(404).json({ message: 'driver not found' });

    const trip = await Trip.create({
      userId,
      driverId,
      paymentMethod,
      pickup: user?.currentLocation,
      destination: user?.destination,
    });

    // mark driver as busy / set destination
    try {
      await Driver.findByIdAndUpdate(driverId, {
        destination: user?.destination,
        active_status: true,
      });
    } catch (e) {
      // non-fatal: log and continue
      console.warn("Failed to set driver status:", e.message);
    }

    // return the trip object directly so frontend `res.data` === trip
    return res.status(201).json(trip);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

const getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "trip id is required" });

    const trip = await Trip.findById(id)
      .populate("userId", "-password")
      .populate("driverId");
    if (!trip) return res.status(404).json({ message: "trip not found" });
    return res.status(200).json({ trip });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

const updateTripStatus = async (req, res) => {
  try {
    const { tripId, status } = req.body;
    if (!tripId || !status)
      return res
        .status(400)
        .json({ message: "tripId and status are required" });

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "trip not found" });

    trip.status = status;
    await trip.save();

    // if trip completed or cancelled, free the driver
    if (status === "completed" || status === "cancelled") {
      try {
        await Driver.findByIdAndUpdate(trip.driverId, { active_status: false });
      } catch (e) {
        console.warn("Failed to set driver available:", e.message);
      }
    }

    // if trip completed with a fare, credit the driver's wallet
    if (status === 'completed' && req.body.fare != null) {
      try {
        const fare = Number(req.body.fare);
        const { Wallet } = require('../../module/wallet');
        await Wallet.findOneAndUpdate(
          { driverId: trip.driverId },
          {
            $inc: { balance: fare },
            $push: {
              transactions: { tripId: trip._id, amount: fare, type: 'credit', note: 'trip fare' },
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } catch (e) {
        console.warn('Failed to credit driver wallet:', e.message);
      }
    }

    return res.status(200).json({ message: "trip status updated", trip });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

const confirmTripByDriver = async (req, res) => {
  try {
    const { tripId, driverId } = req.body;
    if (!tripId || !driverId)
      return res.status(400).json({ message: 'tripId and driverId are required' });

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'trip not found' });

    // Ensure the driver confirming is the assigned driver
    if (String(trip.driverId) !== String(driverId)) {
      return res.status(403).json({ message: 'driver not authorized to confirm this trip' });
    }

    trip.status = 'accepted';
    await trip.save();

    // mark driver as active/busy in driver record
    try {
      await Driver.findByIdAndUpdate(driverId, { active_status: true });
    } catch (e) {
      console.warn('Failed to update driver active_status:', e.message);
    }

    return res.status(200).json({ message: 'trip confirmed by driver', trip });
  } catch (error) {
    return res.status(500).json({ message: 'server error', error: error.message });
  }
};

module.exports = { createTrip, getTripById, updateTripStatus, confirmTripByDriver };
