const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', async function(req, res) {
    res.render('index', {title: 'Hoof Hearted Stables'});
});

router.get('/login', function(req,res){
  res.render('login', {title:'Hoof Hearted Stables | Login'});
});

router.get('/signup', function(req,res){
  res.render('signup', {title:'Hoof Hearted Stables | Signup'});
});

module.exports = router;
