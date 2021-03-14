const { render } = require('ejs');
var express = require('express');
const session = require('express-session');
var router = express.Router();
const Register = require('../models/registers');


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
    res.render('customer/myhorses', { title: `myHorses ${userName.firstname}`});
});

router.get("/bookings", checkSignIn, async (req, res) => {
  const usrId = req.session.user;
  const userName = await Register.findOne({ _id: usrId });
  res.render("customer/book", { title: `bookings ${userName.firstname}` });
});

router.get("/account", checkSignIn, async (req, res) => {
  const usrId = req.session.user;
  const userName = await Register.findOne({ _id: usrId });
  res.render("customer/account", { title: `Account of ${userName.firstname}` });
});

module.exports =router;