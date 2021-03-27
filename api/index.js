const express = require('express');
const router = express.Router();

router
  .use("/login", require("./login"))
  .use("/signup", require("./signup"))
  .use("/booking", require("./booking"))
  .use("/process-payment", require("./payment"));

module.exports = router;