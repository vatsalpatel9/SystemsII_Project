const { boolean } = require("@apimatic/schema");
const mongoose = require("mongoose");

const ridingReserveSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  numPeople:{
    type: Number,
    required: true
  },
  days:{
    type: Date,
    required: true
  },
  duration:{
    type: Number,
    required: true
  },
  paymentStatus:{
    type: Boolean,
    required: true
  },
  paymentAmount:{
    type: Number,
    required: true
  },
  userId:{
    type: String,
    required: true
  }
});

//collection

const ridingReserve = new mongoose.model(
  "Riding_Reserve",
  ridingReserveSchema
);

module.exports = ridingReserve;