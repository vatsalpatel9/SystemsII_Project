const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    actype: {
        type: Number,
        required: true
    },
});

//collection

const Register = new mongoose.model("Register", registerSchema);

module.exports = Register;