const express = require('express');
const session = require('express-session');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  if(!req.session.user){
    console.log(req.session);
    res.render('index', {title: 'hello'});
  }else{
    res.render('customer/index', { title: req.session.user});
  }
});

router.get('/login', function(req,res){
  res.render('login', {title:'login'});
});

router.get('/signup', function(req,res){
  res.render('signup', {title:'signup'});
});

module.exports = router;
