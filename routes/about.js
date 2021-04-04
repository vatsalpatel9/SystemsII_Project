var express = require('express');
var router = express.Router();

/* GET home page. */
/* router.get('/', function(req, res, next) {
  res.render('about', { title: 'about' });
}); */

router.get('/about', function(req,res){
  res.render('about', {title:'HHS-about'});
});

module.exports = router;