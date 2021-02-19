const { render } = require('ejs');
var express = require('express');
var router = express.Router();

router.get('/book', (req, res) => {
    if(!req.session.user){
        console.log(req.session);
        res.render('index', {title: 'hello'});
    }else{
        res.render('customer/book', { title: `book ${req.session.user}`});
    }
});

module.exports =router;