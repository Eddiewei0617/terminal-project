const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

// connect to DB
mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => {
    console.log("Connect to Mongo Atlas");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(8080, () => {
  console.log("Server is running on Port 8080.");
});
