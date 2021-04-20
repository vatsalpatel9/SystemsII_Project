var express = require("express");
const Reservation = require("../models/ridingReserve");
const Lodging = require("../models/horseLodging");
const Training = require("../models/horseTraining");
const Feedback = require("../models/feedback");

var router = express.Router();

router.get("/RidingReserve", async (req, res) => {
    var today = new Date();
    today.setHours(-5,0,0,0);
    console.log(today);
    Reservation.find( {days: today} , function (err, result) {
      if (err) throw err;
      console.log(result);
    }).countDocuments();

  Reservation.find(function (err, allDetails) {
    if (err) {
      console.log(err);
    } else {
      res.render("secret/book", {
        details: allDetails,
        title: `HHS-Riding`,
      });
    }
  });
});

router.get("/TrainingReserve", async(req, res) => {
  Training.find(function (err, allDetails){
    if (err) {
      console.log(err);
    } else {
      res.render("secret/training", {
        details: allDetails,
        title: `HHS-Riding`,
      });
    }
  });
});

router.get("/LodingReserve", async(req, res) => {
    Lodging.find(function (err, allLodgings){
      if(err){
        console.log(err);
      }else{
        res.render("secret/lodging", {
          details: allLodgings,
          title: `HHS-Lodgings`
        })
      }
    });
});

router.get("/feedback", async(req, res) => {
    Feedback.find(function (err, allFeedbacks){
        if (err) {
          console.log(err);
        } else {
          res.render("secret/feedback", {
            details: allFeedbacks,
            title: `HHS-Feedbacks`,
          });
        }
    });
});

module.exports = router;