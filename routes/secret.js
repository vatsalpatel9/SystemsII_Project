var express = require("express");
const Reservation = require("../models/ridingReserve");
const Lodging = require("../models/horseLodging");
const Training = require("../models/horseTraining");
const Feedback = require("../models/feedback");

var router = express.Router();

router.get("/main/:user", async (req, res) => {
  const today = new Date();
  today.setHours(-5, 0, 0, 0);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const nextMonth = new Date();
  nextMonth.setDate(nextMonth.getDate() + 30);

  console.log(nextMonth);

  ////////////////////////////////////////////////////////////
  //--Get Riding reservation count for today
  ////////////////////////////////////////////////////////////
  const ridingCount = await Reservation.find({ days: today }).countDocuments(
    function (err, result) {
      if (err) throw err;
      return result;
    }
  );

  ////////////////////////////////////////////////////////////
  //--Get Training reservation count for today
  ////////////////////////////////////////////////////////////
  const trainingCount = await Training.find({ days: today }).countDocuments(
    function (err, result) {
      if (err) throw err;
      return result;
    }
  );

  ////////////////////////////////////////////////////////////
  //--Get Lodging reservation count for today
  ////////////////////////////////////////////////////////////
  const lodgingCount = await Lodging.find({ startDays: today }).countDocuments(
    function (err, result) {
      if (err) throw err;
      return result;
    }
  );

  ////////////////////////////////////////////////////////////
  //--Get Riding reservation count for Next Week
  ////////////////////////////////////////////////////////////
  const ridingCountWeek = await Reservation.find({
    days: { $gte: today, $lt: nextWeek },
  }).countDocuments(function (err, result) {
    if (err) throw err;
    return result;
  });

  ////////////////////////////////////////////////////////////
  //--Get Training reservation count for Next Week
  ////////////////////////////////////////////////////////////
  const trainingCountWeek = await Training.find({
    days: { $gte: today, $lt: nextWeek },
  }).countDocuments(function (err, result) {
    if (err) throw err;
    return result;
  });

  ////////////////////////////////////////////////////////////
  //--Get Riding reservation count for Next Week
  ////////////////////////////////////////////////////////////
  const lodgingCountWeek = await Lodging.find({
    days: { $gte: today, $lt: nextWeek },
  }).countDocuments(function (err, result) {
    if (err) throw err;
    return result;
  });

  /*
  ////////////////////////////////////////////////////////////
  //--Get Riding reservation count for Next Month
  ////////////////////////////////////////////////////////////
  const ridingCountMonth = await Reservation.find({
    days: { $gte: today, $lt: nextMonth },
  }).countDocuments(function (err, result) {
    if (err) throw err;
    return result;
  });

  ////////////////////////////////////////////////////////////
  //--Get Training reservation count for Next Month
  ////////////////////////////////////////////////////////////
  const trainingCountMonth = await Training.find({
    days: { $gte: today, $lt: nextMonth },
  }).countDocuments(function (err, result) {
    if (err) throw err;
    return result;
  });

  ////////////////////////////////////////////////////////////
  //--Get Riding reservation count for Next Month
  ////////////////////////////////////////////////////////////
  const lodgingCountMonth = await Lodging.find({
    days: { $gte: today, $lt: nextMonth },
  }).countDocuments(function (err, result) {
    if (err) throw err;
    return result;
  }); */

  res.render("secret/index", {
    title: `Welcome Admin ${req.params.user}`,
    ridingTodayNum: ridingCount,
    trainingTodayNum: trainingCount,
    lodgingTodayNum: lodgingCount,
    ridingWeekNum: ridingCountWeek,
    trainingWeekNum: trainingCountWeek,
    lodgingWeekNum: lodgingCountWeek,
  /*  ridingMonthNum: ridingCountMonth,
    trainingMonthNum: trainingCountMonth,
    lodgingMonthNum: lodgingCountMonth,*/
  });
});

router.get("/RidingReserve", async (req, res) => {
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

router.get("/TrainingReserve", async (req, res) => {
  Training.find(function (err, allDetails) {
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

router.get("/LodingReserve", async (req, res) => {
  Lodging.find(function (err, allLodgings) {
    if (err) {
      console.log(err);
    } else {
      res.render("secret/lodging", {
        details: allLodgings,
        title: `HHS-Lodgings`,
      });
    }
  });
});

router.get("/feedback", async (req, res) => {
  Feedback.find(function (err, allFeedbacks) {
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
