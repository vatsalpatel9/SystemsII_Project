const { render } = require('ejs');
var express = require('express');
var router = express.Router();
const Register = require('../models/registers');

router.get('/book', async (req, res) => {
    if(!req.session.user){
        console.log(req.session);
        res.render('index', {title: 'hello'});
    }else{
        const usrId = req.session.user;
        const userName = await Register.findOne({_id:usrId});
        res.render('customer/book', { title: `book ${userName.firstname}`});
    }
});

module.exports =router;