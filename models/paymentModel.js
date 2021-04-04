const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    response:{
        type: Object,
        required: true
    }
});

const paymentModel = new mongoose.model("Payment_Model", paymentSchema);

module.exports = paymentModel;