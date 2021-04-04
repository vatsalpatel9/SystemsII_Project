var express = require("express");
var moment = require("moment");
const Reservation = require("../models/ridingReserve");
const bodyParser = require("body-parser");
const JSONBig = require("json-bigint");
require("dotenv").config();
var router = express.Router();

const { ApiError, Client, Environment } = require("square");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

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
        console.log(reserved.firstname);
        res.redirect("/api/booking/renderPayment");
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
  console.log("invoked");
  const requestParams = req.body;
  console.log(requestParams);
  // Charge the customer's card
  const paymentsApi = client.paymentsApi;
  const requestBody = {
    sourceId: requestParams.nonce,
    amountMoney: {
      amount: 100, // $1.00 charge
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
