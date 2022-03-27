const userCtrl = require("../controllers/userCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

const router = require("express").Router();

router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);
router.get("/logout", userCtrl.logout);
router.get("/refresh_token", userCtrl.refreshToken);
router.get("/info", auth, authAdmin, userCtrl.getUser);
router.put("/addCart", auth, userCtrl.addCart);
router.get("/getHistory", auth, userCtrl.getHistory);

module.exports = router;
