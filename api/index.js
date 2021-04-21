const express = require('express');
const router = express.Router();

router
  .use("/login", require("./login"))
  .use("/signup", require("./signup"))
  .use("/booking", require("./booking"))
  .use("/changePass", require("./changePass"))
  .use("/cancelBookings", require("./cancelBookings"))
  .use("/reply", require("./reply"))

module.exports = router;