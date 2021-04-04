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
  },
  numPeople:{
    type: Number,
    required: true
  },
  days:{
    type: Date,
    required: true
  },
  startTime:{
    type: String,
    required: true
  },
  endTime:{
    type: String,
    requried: true
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
  },
  creationDate:{
    type: Date,
    default: Date.now
  }
});

//collection

const ridingReserve = new mongoose.model(
  "Riding_Reserve",
  ridingReserveSchema
);

module.exports = ridingReserve;