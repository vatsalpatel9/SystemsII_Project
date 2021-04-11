var express = require('express');
var router = express.Router();
const Register = require('../models/registers');
const Lodging = require('../models/horseLodging');
const Training = require('../models/horseTraining');
const Reservation = require("../models/ridingReserve");


function checkSignIn(req, res, next){
   if(req.session.user){
      next();     //If session exists, proceed to page
   } else {
      var err = new Error("Not logged in!");
      console.log(req.session.user);
      res.redirect('/');
      next(err);  //Error, trying to access unauthorized page!
   }
}

router.get('/myhorses', checkSignIn, async (req, res) => {
    const usrId = req.session.user;
    const userName = await Register.findOne({_id:usrId});
    Lodging.find({userId: usrId}, function(err, lodgingDetail){
      if(err){
         console.log(err);
      }else{
         Training.find({ userId: usrId }, function (err, trainDetail) {
           if (err) {
             console.log(err);
           } else {
             res.render("customer/myhorses", {
               lodgingDet: lodgingDetail,
               trainDet: trainDetail,
               title: `HHS-myHorses | ${userName.firstname}`,
             });
           }
         });
      }
    });
});

router.get("/bookings", checkSignIn, async (req, res) => {
  const usrId = req.session.user;
  const userName = await Register.findOne({ _id: usrId });
  Reservation.find({userId: usrId}, function(err, allDetails){
   if(err){
      console.log(err);
   }else{
      res.render("customer/book", { details: allDetails, title: `HHS-bookings | ${userName.firstname}` });
   }
  });
 // res.render("customer/book", { title: `bookings ${userName.firstname}` });
});

router.get("/account", checkSignIn, async (req, res) => {
  const usrId = req.session.user;
  const userName = await Register.findOne({ _id: usrId });
  res.render("customer/account", { title: `HHS-Account | ${userName.firstname}` });
});

module.exports =router;