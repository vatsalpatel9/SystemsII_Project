const express = require('express');
const router = express.Router();
require('dotenv').config();

router
  .use("/", require("./main_view"))
  .use("/customer/", require("./customer"))

module.exports = router;