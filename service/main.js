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

    // وصل الكارت للـ Stripe Customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: user.stripeCustomerId,
    });

    const newCard = {
      id: paymentMethodId,
      brand: brand || "Card",
      last4: last4 || "4242",
      isDefault: true,
    };

    // خطوة واحدة لتحديث Default للكروت السابقة
    // وتحديث الكارت الموجود إذا موجود
    const result = await User.updateOne(
      { _id: userId },
      {
        $set: {
          "paymentMethods.$[elem].isDefault": false, // كل الكروت السابقة غير Default
          "paymentMethods.$[target]": newCard, // تحديث الكارت الموجود
        },
      },
      {
        arrayFilters: [
          { "elem.id": { $ne: paymentMethodId } }, // لكل الكروت الغير المستهدفة
          { "target.id": paymentMethodId }, // الكارت اللي هيتحدث
        ],
      },
    );

    // لو الكارت مش موجود → أضف جديد
    if (result.matchedCount === 0 || result.modifiedCount === 0) {
      await User.updateOne(
        { _id: userId },
        { $push: { paymentMethods: newCard } },
      );
    }

    // جلب الكروت بعد التحديث
    const updatedUser = await User.findById(userId).select("paymentMethods");

    res.json({ success: true, paymentMethods: updatedUser.paymentMethods });
  },
);

module.exports = router;
