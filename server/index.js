const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router = require("./routes/auth");
require("dotenv").config();
const authRoute = require("./routes").auth;

// connect to DB
mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => {
    console.log("Connect to Mongo Atlas");
  })
  .catch((e) => {
    console.log(e);
  });

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", authRoute);

app.listen(8080, () => {
  console.log("Server is running on Port 8080.");
});
