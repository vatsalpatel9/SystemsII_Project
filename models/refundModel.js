const mongoose = require("mongoose");

const refundSchema = new mongoose.Schema({
  response: {
    type: Object,
    required: true,
  },
});

const refundModel = new mongoose.model("Refund_Model", refundSchema);

module.exports = refundModel;
