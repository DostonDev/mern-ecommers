const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Payment = require("../models/paymentModel");

const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: "Email already exist." });

      if (password.length < 6) return res.status(400).json({ msg: "Password is at least 6 charracters long." });

      const hashPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashPassword,
      });

      const refreshToken = createRefreshToken({ id: newUser._id });
      const accessToken = createAccessToken({ id: newUser._id });

      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      await newUser.save();

      res.json({ msg: "registered", accessToken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Incorrect password." });

      const accessToken = createAccessToken({ id: user._id });
      const refreshToken = createRefreshToken({ id: user._id });
      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ user, accessToken });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      res.json({ msg: "Logged out" });
    } catch (error) {
      return res.status(500).json({ msg: err.message });
    }
  },
  refreshToken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return res.status(400).json({ msg: "Please Login or Register." });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, async (err, result) => {
        if (err) return res.status(400).json({ msg: "Please Login or Register.", err });
        const accessToken = createAccessToken({ id: result.id });
        const user = await User.findOne({ _id: result.id }).select("-password");
        return res.json({ user, accessToken });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) return res.status(400).json({ msg: "User does not exist." });
      res.json(user);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  addCart: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          cart: req.body.cart,
        }
      );

      return res.json({ msg: "Added to cart." });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  getHistory: async (req, res) => {
    try {
      const history = await Payment.find({ user_id: req.user.id });

      return res.json(history);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

const createAccessToken = user => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};
const createRefreshToken = user => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
};

module.exports = userCtrl;
