const { Wallet } = require("../../module/wallet");

const getWalletByDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    if (!driverId)
      return res.status(400).json({ message: "driverId is required" });
    const wallet = await Wallet.findOne({ driverId });
    if (!wallet) return res.status(404).json({ message: "wallet not found" });
    return res.status(200).json(wallet);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

const creditWallet = async (req, res) => {
  try {
    const { driverId, amount, tripId, note } = req.body;
    if (!driverId || amount == null)
      return res
        .status(400)
        .json({ message: "driverId and amount are required" });

    const update = {
      $inc: { balance: Number(amount) },
      $push: {
        transactions: { tripId, amount: Number(amount), type: "credit", note },
      },
    };

    const wallet = await Wallet.findOneAndUpdate({ driverId }, update, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
    return res.status(200).json({ message: "wallet credited", wallet });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

const debitWallet = async (req, res) => {
  try {
    const { driverId, amount, note } = req.body;
    if (!driverId || amount == null)
      return res
        .status(400)
        .json({ message: "driverId and amount are required" });

    const wallet = await Wallet.findOne({ driverId });
    if (!wallet) return res.status(404).json({ message: "wallet not found" });
    if (wallet.balance < Number(amount))
      return res.status(400).json({ message: "insufficient balance" });

    wallet.balance = wallet.balance - Number(amount);
    wallet.transactions.push({ amount: Number(amount), type: "debit", note });
    await wallet.save();
    return res.status(200).json({ message: "wallet debited", wallet });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

module.exports = { getWalletByDriver, creditWallet, debitWallet };
