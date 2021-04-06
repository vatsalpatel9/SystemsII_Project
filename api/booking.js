var express = require("express");
var moment = require("moment");
const crypto = require("crypto");
const Reservation = require("../models/ridingReserve");
const paymentModel = require("../models/paymentModel");
const bodyParser = require("body-parser");
const JSONBig = require("json-bigint");
require("dotenv").config();
var router = express.Router();

const { ApiError, Client, Environment } = require("square");
const { duration } = require("moment");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//////////////////////////////////////////////////////////////////////////////////
//--Pass current reservation to payment process
//////////////////////////////////////////////////////////////////////////////////
var currId;
function storeReserveID(id){
  currId = id;
  console.log("currID: " + currId);
}

function getCurrId(){
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
//--Post reservation info to database
//////////////////////////////////////////////////////////////////////////////////
router.post('/',  async (req, res) => {
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

    try{
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
            userId: req.session.user
        });
        const reserved = await reserve.save();
        const reservationId = reserved._id;
        storeReserveID(reservationId);
        res.render("customer/payment", {price: price});
    }catch(error){
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
  const reserPrice = await Reservation.findOne({ _id: getCurrId() });
  const price = reserPrice.paymentAmount * 100;

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
