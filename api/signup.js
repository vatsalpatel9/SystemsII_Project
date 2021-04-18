var express = require('express');
const Register = require('../models/registers');
const bcrypt = require('bcrypt');
var router = express.Router();

//create user
router.post('/', async (req, res) => {
    try{
      const password = req.body.password;
      const cpassword = req.body.confirmpassword;
      const email = req.body.email;

      // REGEX for email validation
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
          console.log("emailcheckworking");
        return res.redirect(
           `/signup?errType=InvaildEmail`
        );
      }

      console.log(password, " ", cpassword);

      if (password === cpassword) {
        const signUp = new Register({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: email,
          phone: req.body.phone,
          password: bcrypt.hashSync(password, 10),
          actype: 1,
        });
        const registered = await signUp.save();
        req.session.user = registered._id;
        console.log(req.session.user);
        res.redirect("/");
      } else {
        return res.redirect("/signup?errType=PasswordMismatch");
      }
    }catch (error){
        res.status(400).send(error)
    }

});

module.exports = router;