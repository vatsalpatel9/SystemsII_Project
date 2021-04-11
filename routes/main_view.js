const express = require('express');
const router = express.Router();
const Register = require("../models/registers");
const session = require("express-session");

/* GET home page. */
router.get('/', async function(req, res) {
    if(!req.session.user){
      res.render("index", { title: "Hoof Hearted Stables" });
    }else{
      const usrId = req.session.user;
      const userName = await Register.findOne({ _id: usrId });
      var userType = userName.actype;
      if(userType === 0){
        res.render("secret/index", {title: `Welcome Admin ${userName.firstname}`});
      }else{
        res.render("customer/index", { 
          title: `HHS | ${userName.firstname}`,
          username: userName.firstname
        });
      }
    }
});

router.get('/login', function(req,res){
  res.render('login', {title:'HHS | Login'});
});

router.get('/signup', function(req,res){
  res.render('signup', {title:'HHS | Signup'});
});

module.exports = router;
