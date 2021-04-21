const express = require('express');
const Feedback = require('../models/feedback');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/', async(req, res) => {
    const requestParams = req.body;
    const subject = `Reply for: ${requestParams.subject}`;
    const email = requestParams.email;
    const ogMessage = requestParams.message;
    const id = requestParams.id;
    const bodyText = requestParams.input;
    const sendText = `Original Message:
                      ${ogMessage}\n\n${bodyText}`

    try{
      //////////////////////////////////////////////////////////////////////////////
      //--SEND FEEDBACK REPLY
      //////////////////////////////////////////////////////////////////////////////
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS,
        },
      });

      var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: sendText,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      //////////////////////////////////////////////////////////////////////////////
      //--Delete FEEDBACK REPLY
      //////////////////////////////////////////////////////////////////////////////
      await Feedback.deleteOne(
        { _id: id},
        function (err, res) {
          if (err) {
            console.log("fail");
            throw err;
          } else {
            console.log("success!");
          }
        }
      );

      res.status(200).json({
        title: "Successfully Cancel",
      });
    }catch(err){
        res.status(404).json({
          title: "Failure",
        });
    }
});

module.exports = router;