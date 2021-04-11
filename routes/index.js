const express = require('express');
const router = express.Router();
require('dotenv').config();

router
  .use("/", require("./main_view"))
  .use("/customer/", require("./customer"))
  .use("/feedback/", require("./feedback"))
  .use("/secret/", require("./secret"));

module.exports = router;