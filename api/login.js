var express = require('express');
const Register = require('../models/registers');
const bcrypt = require('bcrypt');
var router = express.Router();

router.post('/', async(req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
        const useremail = await Register.findOne({email:email});

        bcrypt.compare(password, useremail.password, function(err, result) {
            if (result) {
                console.log(email, password);
                req.session.user = useremail.firstname;
                console.log(req.session);
                res.redirect('/');
            } else {
                res.send("Invaild email or password");
            }
        });

    }catch (error){
        res.status(400).send("invalid email");
    }
});

module.exports =router;