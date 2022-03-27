const productCtrl = require("../controllers/productCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

const router = require("express").Router();

router.route("/products").get(productCtrl.getProducts).post(auth, authAdmin, productCtrl.createProduct);
router
  .route("/products/:id")
  .delete(auth, authAdmin, productCtrl.deleteProduct)
  .put(auth, authAdmin, productCtrl.updateProduct);

module.exports = router;
