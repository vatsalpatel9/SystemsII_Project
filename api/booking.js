var express = require("express");
var moment = require("moment");
const SERVICE_TYPE = require("../misc/service_type");
const Reservation = require("../models/ridingReserve");
const Training = require("../models/horseTraining");
const Lodging = require("../models/horseLodging");
const paymentModel = require("../models/paymentModel");
const bodyParser = require("body-parser");
const JSONBig = require("json-bigint");
require("dotenv").config();
var router = express.Router();

const { ApiError, Client, Environment } = require("square");
const { LODGING } = require("../misc/service_type");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//////////////////////////////////////////////////////////////////////////////////
//--Pass current reservation to payment process
//////////////////////////////////////////////////////////////////////////////////
var currId;
var service;
function storeReserveID(id) {
  currId = id;
  console.log("currID: " + currId);
}

function getCurrId() {
  return currId;
}

//////////////////////////////////////////////////////////////////////////////////
//   Set the Access Token which is used to authorize to a merchant
//   Initialized the Square api client:
//   Set sandbox environment for testing purpose
//   Set access token
//////////////////////////////////////////////////////////////////////////////////
const accessToken = process.env.ACCESSTOKEN;
const client = new Client({
  environment: Environment.Sandbox,
  accessToken: accessToken,
});

//////////////////////////////////////////////////////////////////////////////////
//--Post RIDING reservation info to database
//////////////////////////////////////////////////////////////////////////////////
router.post("/riding", async (req, res) => {
  const date = req.body.days;
  const formattedStart = moment(req.body.StartTime, ["h:mm A"]).format("HH:mm");
  const formattedEnd = moment(req.body.EndTime, ["h:mm A"]).format("HH:mm");
  const subStart = formattedStart.substring(0, 2);
  const subEnd = formattedEnd.substring(0, 2);
  const duration = subEnd - subStart;
  const price = duration * 70;

  //Remove for production
  console.log("Start: " + formattedStart);
  console.log("end: " + formattedEnd);
  console.log("Date: " + date);
  console.log("Duration: " + duration);
  console.log("price: " + price);

  try {
    const reserve = new Reservation({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phone: req.body.phone,
      numPeople: req.body.numPeople,
      days: date,
      startTime: req.body.StartTime,
      endTime: req.body.EndTime,
      duration: duration,
      paymentStatus: false,
      paymentAmount: price,
      userId: req.session.user,
    });
    const reserved = await reserve.save();
    const reservationId = reserved._id;
    storeReserveID(reservationId);
    service = "Riding";
    res.render("customer/payment", { price: price });
  } catch (error) {
    res.status(400).send(error);
  }
});

//////////////////////////////////////////////////////////////////////////////////
//--Post HORSE TRANNING reservation info to database
//////////////////////////////////////////////////////////////////////////////////
router.post("/training", async (req, res) => {
  const date = req.body.days;
  const formattedStart = moment(req.body.StartTime, ["h:mm A"]).format("HH:mm");
  const formattedEnd = moment(req.body.EndTime, ["h:mm A"]).format("HH:mm");
  const subStart = formattedStart.substring(0, 2);
  const subEnd = formattedEnd.substring(0, 2);
  const duration = subEnd - subStart;
  const price = duration * 100;

  //Remove for production
  console.log("Start: " + formattedStart);
  console.log("end: " + formattedEnd);
  console.log("Date: " + date);
  console.log("Duration: " + duration);
  console.log("price: " + price);

  try {
    const reserve = new Training({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phone: req.body.phone,
      horseName: req.body.horsename,
      days: date,
      startTime: req.body.StartTime,
      endTime: req.body.EndTime,
      duration: duration,
      paymentStatus: false,
      paymentAmount: price,
      userId: req.session.user,
    });
    const reserved = await reserve.save();
    const reservationId = reserved._id;
    storeReserveID(reservationId);
    service = "Training";
    res.render("customer/payment", { price: price });
  } catch (error) {
    res.status(400).send(error);
  }
});

//////////////////////////////////////////////////////////////////////////////////
//--Post HORSE LODGING reservation info to database
//////////////////////////////////////////////////////////////////////////////////
router.post("/loding", async (req, res) => {
  const numDays = req.body.months * 30;
  const horseType = req.body.horsetype;
  const duration = req.body.months;
  var price;

  let startdate = new Date(req.body.startDay);
  startdate = new Date(startdate.getTime() + startdate.getTimezoneOffset() * 60000);
  let enddate = new Date(req.body.startDay);
  enddate = new Date(enddate.getTime() + enddate.getTimezoneOffset() * 60000);
  enddate.setDate(enddate.getDate() + numDays);
  
  if(horseType === "stable"){
    price = duration*300;
  }else if(horseType === "pasture"){
    price = duration*250;
  }

  //Remove for production
  console.log("StartDate: " + startdate);
  console.log("EndDate: " + enddate);
  console.log("Duration: " + duration);
  console.log("Type: " + horseType);
  console.log("Price: " + price);

  try {
    const reserve = new Lodging({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phone: req.body.phone,
      horseName: horseName,
      horseType: horseType,
      startDay: startdate,
      endDay: enddate,
      duration: duration,
      paymentStatus: false,
      paymentAmount: price,
      userId: req.session.user,
    });
    const reserved = await reserve.save();
    const reservationId = reserved._id;
    storeReserveID(reservationId);
    service = "Lodging";
    res.render("customer/payment", { price: price });
  } catch (error) {
    res.status(400).send(error);
  }
});

//////////////////////////////////////////////////////////////////////////////////
//--Get the payment form page
//////////////////////////////////////////////////////////////////////////////////
router.get("/renderPayment", (req, res) => {
  res.render("customer/payment");
});

//////////////////////////////////////////////////////////////////////////////////
//--Post the payment to server
//////////////////////////////////////////////////////////////////////////////////
router.post("/payment", async (req, res) => {
  const requestParams = req.body;
  console.log(requestParams);

  ////////////////////////////////////////////
  //--Get price amount
  ////////////////////////////////////////////
  var price;
  switch (service) {
    case SERVICE_TYPE.RIDING: {
      const reserPrice = await Reservation.findOne({ _id: getCurrId() });
      console.log("Price: " + reserPrice);
      price = reserPrice.paymentAmount * 100;
      break;
    }
    case SERVICE_TYPE.TRAINING: {
      const reserPrice = await Training.findOne({ _id: getCurrId() });
      console.log("Price: " + reserPrice);
      price = reserPrice.paymentAmount * 100;
      break;
    }
    case SERVICE_TYPE.LODGING: {
      const reserPrice = await Lodging.findOne({ _id: getCurrId() });
      console.log("Price: " + reserPrice);
      price = reserPrice.paymentAmount * 100;
      break;
    }
  }

  // Charge the customer's card
  const paymentsApi = client.paymentsApi;
  const requestBody = {
    sourceId: requestParams.nonce,
    amountMoney: {
      amount: price,
      currency: "USD",
    },
    locationId: requestParams.location_id,
    idempotencyKey: requestParams.idempotency_key,
  };

  try {
    console.log("enter try block!");
    const response = await paymentsApi.createPayment(requestBody);
    const parsedResponse = JSONBig.parse(JSONBig.stringify(response));
    console.log(response);
    console.log("URL: " + response.result.payment.receiptUrl);
    res.status(200).json({
      title: "Payment Successful",
      result: parsedResponse.result,
    });

    ///////////////////////////////////////////
    //--log payment conformation
    ///////////////////////////////////////////
    try {
      const payment_details = new paymentModel({
        response: parsedResponse,
      });
      const saved = await payment_details.save();
    } catch (error) {
      res.status(400).send("Database Storage Failed: " + error);
    }

    ///////////////////////////////////////////
    //--Update payment status
    ///////////////////////////////////////////
    try {
      const reservationId = getCurrId();
      const newvalues = {
        $set: {
          paymentStatus: true,
          paymentId: response.result.payment.id,
          paymentUrl: response.result.payment.receiptUrl,
        },
      };
      switch (service) {
        case SERVICE_TYPE.RIDING: {
          Reservation.updateOne(
            { _id: reservationId },
            newvalues,
            function (err, res) {
              if (err) {
                throw err;
              } else {
                console.log("Update successful");
              }
            }
          );
          break;
        }
        case SERVICE_TYPE.TRAINING: {
          Training.updateOne(
            { _id: reservationId },
            newvalues,
            function (err, res) {
              if (err) {
                throw err;
              } else {
                console.log("Update successful");
              }
            }
          );
        }
        case SERVICE_TYPE.LODGING: {
          Lodging.updateOne(
            { _id: reservationId },
            newvalues,
            function (err, res) {
              if (err) {
                throw err;
              } else {
                console.log("Update successful");
              }
            }
          );
        }
      }
    } catch (error) {
      res.status(400).send("Payment Status Updated: " + error);
    }

    console.log("exit try block!");
  } catch (error) {
    let errorResult = null;
    if (error instanceof ApiError) {
      console.log("if error entered");
      errorResult = error.errors;
    } else {
      console.log("else entered");
      errorResult = error;
      console.log(error);
    }
    res.status(500).json({
      title: "Payment Failure",
      resul: errorResult,
    });
  }
});

module.exports = router;
