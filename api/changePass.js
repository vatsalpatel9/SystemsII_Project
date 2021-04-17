var express = require("express");
const Register = require("../models/registers");
const bcrypt = require("bcrypt");
var router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const user = await Register.findOne({ _id: req.session.user });
    const currPass = req.body.currPass;
    if (req.body.newPass === req.body.newPass2) {
      bcrypt.compare(currPass, user.password, function (err, result) {
        const newPassword = {
          $set: { password: bcrypt.hashSync(req.body.newPass, 10) },
        };
        if (result) {
          Register.updateOne(
            { _id: req.session.user },
            newPassword,
            function (err, res) {
              if (err) {
                throw err;
              } else {
                console.log("success!");
                next();
              }
            }
          );
        } else {
          res.send("Invaild email or password");
        }
      });
    } else {
      res.send("password are not matching");
    }
  } catch (error) {
    res.status(400).send("invalid email");
  }
  res.redirect('/');
});

module.exports = router;
