const { connect } = require("mongodb");
const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.DATABASE_ACCESS, {
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("connection made!")
}).catch((e) => {
    console.log("connection failed")
});