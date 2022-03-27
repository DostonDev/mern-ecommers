const paymentCtrl = require("../controllers/paymentCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

const router = require("express").Router();

router.route("/payment").get(auth, authAdmin, paymentCtrl.getPayments).post(auth, paymentCtrl.createPayment);

module.exports = router;
