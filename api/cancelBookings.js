const express = require("express");
const Reservation = require("../models/ridingReserve");
const Register = require("../models/registers");
const Training = require("../models/horseTraining");
const Lodging = require("../models/horseLodging");
const refundModel = require("../models/refundModel");
const Feedback = require("../models/feedback");
const nodemailer = require("nodemailer");
const router = express.Router();
const SERVICE_TYPE = require("../misc/service_type");
const { ApiError, Client, Environment } = require("square");
require("dotenv").config();

const accessToken = process.env.ACCESSTOKEN;
const client = new Client({
  environment: Environment.Sandbox,
  accessToken: accessToken,
});

router.post("/adminCancel", async (req, res) => {
  const requestParams = req.body;
  const service = requestParams.service;
  const userType = requestParams.userType;
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
    //--Log refunds
    //////////////////////////////////////////////////////////////////////////////
    try {
      const refund_details = new refundModel({
        response: response,
      });
      await refund_details.save();
    } catch (error) {
      res.status(400).send("Database Storage Failed: " + error);
    }

    //////////////////////////////////////////////////////////////////////////////
    //--Send Cancel request based on user type
    //////////////////////////////////////////////////////////////////////////////
    var userId = await Register.findOne({ _id: requestParams.userId });
    const userName = userId.firstname;
    const userEmail = userId.email;
    const userPhone = userId.phone;
    const refundAmount = response.result.refund.amountMoney.amount;
    const refundId = response.result.refund.id;
    switch (userType) {
      case 'admin': {
          //////////////////////////////////////////////////////////////////////////////
          //--Mail ADMIN Cancel request
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
            to: userEmail,
            subject: "Reservation Canceled",
            text: `Hello ${userName}, 
             Thank you for using Hoof Hearted Stables services. Sorry We have to cancel you
             reservation.\n
             Please contact us at +1(870)-656-7359 regarding any question. We are sorry for the inconvience. \n
             Your reservation cancel code is: ${refundId}\n
             You have been refunded $${refundAmount}\n
             \nThank you for choosing Hoof Hearted Stables!`,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
        }
        break;
      case 'user': {
        const message = `User ${userName} has canceled their ${service} reservation.\n
                         A refund of $${refundAmount} was issued. Pending verification.\n
                         The refund Id is: ${refundId}\n
                         User contact is: ${userPhone}`;

        const text = `Hello ${userName}, 
             Thank you for using Hoof Hearted Stables services. Your ${service} reservation cancelation request have been recieved.\n
             A refund will be issued with 3-5 business days.\n
             Your reservation cancel code is: ${refundId}\n
             You will be refunded $${refundAmount}\n
             Please contact us at +1(870)-656-7359 regarding any question.\n
             Thank you for choosing Hoof Hearted Stables!`;

        //////////////////////////////////////////////////////////////////////////////
        //--Mail Cancel request confirmation
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
          to: userEmail,
          subject: "Reservation Cancelation Request",
          text: text,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });

        //////////////////////////////////////////////////////////////////////////////
        //--Mail USER Cancel request
        //////////////////////////////////////////////////////////////////////////////
        const cancelRequest = new Feedback({
          name: userName,
          email: userEmail,
          subject: "Cancelation Request -- Auto Generated",
          message: message,
        });
        await cancelRequest.save();
      }

    }

    res.status(200).json({
      title: "Successfully Cancel",
    });
    console.log(response.result);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
