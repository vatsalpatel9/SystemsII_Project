const express = require('express');
const session = require('express-session');
const router = express.Router();
const Register = require('../models/registers');

/* GET home page. */
router.get('/', async function(req, res) {
  if(!req.session.user){
    console.log(req.session);
    res.render('index', {title: 'hello'});
  }else{
      const usrId = req.session.user;
      const userName = await Register.findOne({_id:usrId});
      res.render('customer/index', { title: userName.firstname});
  }
});

router.get('/login', function(req,res){
  res.render('login', {title:'login'});
});

router.get('/signup', function(req,res){
  res.render('signup', {title:'signup'});
});

module.exports = router;
