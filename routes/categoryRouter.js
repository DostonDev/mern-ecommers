const categoryCtrl = require("../controllers/categoryCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

const router = require("express").Router();

router.route("/category").get(categoryCtrl.getCategory).post(auth, authAdmin, categoryCtrl.createCategory);

router
  .route("/category/:id")
  .delete(auth, authAdmin, categoryCtrl.deleteCategory)
  .put(auth, authAdmin, categoryCtrl.updateCategory);

module.exports = router;
