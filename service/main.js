const Stripe = require("stripe");
const { User } = require("../module/user");
const { validation } = require("../utils/common.validation");
const {
  createCustomerSchema,
  addPaymentMethodSchema,
} = require("../validation/payment.validation");

require("dotenv").config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Secret key
const router = require("express").Router();

router.post(
  "/create-customer",
  validation(createCustomerSchema),
  async (req, res) => {
    const { userId, email } = req.body;

    const customer = await stripe.customers.create({ email });

    await User.findByIdAndUpdate(userId, { stripeCustomerId: customer.id });

    res.json({
      message: "Customer created successfully in stripe",
    });
  },
);

router.post(
  "/add-payment-method",
  validation(addPaymentMethodSchema),
  async (req, res) => {
    const { paymentMethodId, brand, last4, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
      });

      await User.updateOne({ _id: userId }, { stripeCustomerId: customer.id });

      user.stripeCustomerId = customer.id;
    }

    // ✅ attach
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: user.stripeCustomerId,
    });

    const newCard = {
      id: paymentMethodId,
      brand: brand || "Card",
      last4: last4 || "4242",
      isDefault: true,
    };

    // ✅ خلي كل الكروت false
    await User.updateOne(
      { _id: userId },
      { $set: { "paymentMethods.$[].isDefault": false } },
    );

    // ✅ check لو الكارت موجود
    const exists = await User.findOne({
      _id: userId,
      "paymentMethods.id": paymentMethodId,
    });

    if (exists) {
      // update
      await User.updateOne(
        { _id: userId, "paymentMethods.id": paymentMethodId },
        { $set: { "paymentMethods.$": newCard } },
      );
    } else {
      // add
      await User.updateOne(
        { _id: userId },
        { $push: { paymentMethods: newCard } },
      );
    }

    const updatedUser = await User.findById(userId).select("paymentMethods");

    res.json({ success: true, paymentMethods: updatedUser.paymentMethods });
  },
);

module.exports = router;
