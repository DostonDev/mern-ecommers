const router = require("express").Router();
const fs = require("fs");

const cloudinary = require("cloudinary");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

router.post("/upload", auth, authAdmin, async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) return res.status(400).json({ msg: "File not uploaded." });
    const file = req.files.file;
    console.log(file);

    if (file.size > 1024 * 1024*5) {
      removeTmp(file.tempFilePath);
      return res.status(400).json({ msg: "File size too large." });
    }
    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
      removeTmp(file.tempFilePath);
      return res.status(400).json({ msg: "File format is wrong." });
    }

    cloudinary.v2.uploader.upload(file.tempFilePath, { folder: "test" }, async (err, result) => {
      if (err) throw err;
      removeTmp(file.tempFilePath);
      res.json({ public_id: result.public_id, url: result.secure_url });
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

router.post("/destroy", auth, authAdmin, async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) return res.status(400).json({ msg: "Image is not selected" });

    cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
      if (err) throw err;

      res.json({ msg: "Deleted" });
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

const removeTmp = path => {
  fs.unlink(path, err => {
    if (err) throw err;
  });
};

module.exports = router;
