var express = require("express");
const Reservation = require("../models/ridingReserve");
var router = express.Router();

router.post('/',  async (req, res) => {
    var start = req.body.StartTime;
    var end = req.body.EndTime;
    const date = req.body.days;
    var subStart = start.substring(0,2);
    var subEnd = end.substring(0,2);
    var duration = subEnd - subStart;

    console.log("Start: " + start);
    console.log("end: " + end);
    console.log("Date: " + duration);
    console.log("price: " + 90*duration);

    try{
        const reserve = new Reservation({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phone: req.body.phone,
            numPeople: req.body.numPeople,
            days: date,
            duration: duration,
            userId: req.session.user
        });
        const reserved = await reserve.save();
        console.log(reserved.firstname);
        res.redirect('/customer/bookings');
    }catch(error){
        res.status(400).send(error);
    }
});

module.exports = router;
