const Payment = require("../models/paymentModel");
const productModel = require("../models/productModel");
const User = require("../models/userModel");

const paymentCtrl = {
  getPayments: async (req, res) => {
    try {
      const payments = await Payment.find();
      return res.json(payments);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createPayment: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("name email");
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      const { cart, paymentId, address } = req.body;
      const { _id, name, email } = user;

      const newPayment = new Payment({
        user_id: _id,
        name,
        email,
        cart,
        paymentId,
        address,
      });

      cart.forEach(item => {
        sold(item._id, item.quantity, item.sold);
      });

      await newPayment.save();
      res.json(newPayment);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

const sold = async (id, newCount, oldCount) => {
  await productModel.findOneAndUpdate(
    { _id: id },
    {
      sold: newCount + oldCount,
    }
  );
};

module.exports = paymentCtrl;
