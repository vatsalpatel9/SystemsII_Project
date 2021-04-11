var express = require("express");
const Reservation = require("../models/ridingReserve");
const Feedback = require("../models/feedback");

var router = express.Router();

router.get("/ridingReserve", async (req, res) => {
  Reservation.find(function (err, allDetails) {
    if (err) {
      console.log(err);
    } else {
      res.render("secret/book", {
        details: allDetails,
        title: `HHS-bookings`,
      });
    }
  });
});

router.get("/lodingReserve", async(req, res) => {
    res.render("secret/lodging", {title: `Secret Lodging`});
});

router.get("/feedback", async(req, res) => {
    Feedback.find(function (err, allFeedbacks){
        if (err) {
          console.log(err);
        } else {
          res.render("secret/feedback", {
            details: allFeedbacks,
            title: `HHS-bookings`,
          });
        }
    });
});

module.exports = router;