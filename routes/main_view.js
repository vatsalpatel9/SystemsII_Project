const express = require('express');
const session = require('express-session');
const router = express.Router();
const Register = require('../models/registers');

/* GET home page. */
router.get('/', async function(req, res) {
    res.render('index', {title: 'hello'});
});

router.get('/login', function(req,res){
  res.render('login', {title:'login'});
});

router.get('/signup', function(req,res){
  res.render('signup', {title:'signup'});
});

module.exports = router;
