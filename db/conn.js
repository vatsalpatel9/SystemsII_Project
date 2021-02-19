const { connect } = require("mongodb");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://appUser:8rod40huijz75698@cluster0.rqilf.mongodb.net/appInfo?retryWrites=true&w=majority", {
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("connection made!")
}).catch((e) => {
    console.log("connection failed")
});