const express = require("express");
const bodyParser = require("body-parser");
const JSONBig = require("json-bigint");
require('dotenv').config();

var router = express.Router();
const { ApiError, Client, Environment } = require("square");

router.get("/", (req, res) => {
  res.render("customer/payment");
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Set the Access Token which is used to authorize to a merchant
const accessToken = process.env.ACCESSTOKEN;

// Initialized the Square api client:
//   Set sandbox environment for testing purpose
//   Set access token
const client = new Client({
  environment: Environment.Sandbox,
  accessToken: accessToken,
});

router.post("/", async (req, res) => {
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
      'title': "Payment Failure",
      'resul': errorResult
    });
  }
});

module.exports = router;
