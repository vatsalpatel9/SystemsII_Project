var express = require("express");
var Reservation = require("../models/ridingReserve");
var Register = require("../models/registers");
var Training = require("../models/horseTraining");
var Lodging = require("../models/horseLodging");
var nodemailer = require("nodemailer");
require("dotenv").config();
var router = express.Router();
const SERVICE_TYPE = require("../misc/service_type");
const { ApiError, Client, Environment } = require("square");

const accessToken = process.env.ACCESSTOKEN;
const client = new Client({
  environment: Environment.Sandbox,
  accessToken: accessToken,
});

router.post("/adminCancel", async (req, res) => {
  const requestParams = req.body;
  const service = requestParams.service;
  console.log(requestParams.idempotency_key);
  try {
    const response = await client.refundsApi.refundPayment({
      idempotencyKey: requestParams.idempotency_key,
      amountMoney: {
        amount: requestParams.amount,
        currency: "USD",
      },
      paymentId: requestParams.id,
    });

    //////////////////////////////////////////////////////////////////////////////
    //--Delete DB Entry
    //////////////////////////////////////////////////////////////////////////////
    switch (service) {
      case SERVICE_TYPE.RIDING: {
        await Reservation.deleteOne(
          { _id: requestParams.reserveId },
          function (err, res) {
            if (err) {
              console.log("fail");
              throw err;
            } else {
              console.log("success!");
            }
          }
        );
        break;
      }
      case SERVICE_TYPE.TRAINING: {
        await Training.deleteOne(
          { _id: requestParams.reserveId },
          function (err, res) {
            if (err) {
              console.log("fail");
              throw err;
            } else {
              console.log("success!");
            }
          }
        );
        break;
      }
      case SERVICE_TYPE.LODGING: {
        await Lodging.deleteOne(
          { _id: requestParams.reserveId },
          function (err, res) {
            if (err) {
              console.log("fail");
              throw err;
            } else {
              console.log("success!");
            }
          }
        );
        break;
      }
    }

    //////////////////////////////////////////////////////////////////////////////
    //--Mail Cancel request
    //////////////////////////////////////////////////////////////////////////////
    var userId = await Register.findOne({ _id: requestParams.userId });
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    var mailOptions = {
      from: process.env.EMAIL,
      to: userId.email,
      subject: "Reservation Canceled",
      text: `Hello ${userId.firstname}, 
             Thank you for using Hoof Hearted Stables services. Sorry We have to cancel you
             reservation.\n
             Please contact us at CONTACT INFO regarding any question. We are sorry for the inconvience. \n
             Your reservation cancel code is: ${response.result.refund.id}\n
             You have been refunded $${response.result.refund.amountMoney.amount}\n
             \nThank you for choosing Hoof Hearted Stables!`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).json({
      title: "Successfully Cancel",
    });
    console.log(response.result);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
