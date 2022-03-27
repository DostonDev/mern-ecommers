require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// MONGO_URL=mongodb://localhost:27017/eCommerce
//
// MONGO_URL=mongodb+srv://admin:root@cluster0.x1u13.mongodb.net/eCommerce?retryWrites=true&w=majority

app.use("/user", require("./routes/userRouter"));
app.use("/api", require("./routes/categoryRouter"));
app.use("/api", require("./routes/upload"));
app.use("/api", require("./routes/productRouter"));
app.use("/api", require("./routes/paymentRouter"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(
  MONGO_URL,
  {
    useNewUrlParser: true,
  },
  err => {
    if (err) throw err;
    console.log("Connected to MongoDb");
  }
);

app.listen(PORT, () => {
  console.log("Server is running...");
});
