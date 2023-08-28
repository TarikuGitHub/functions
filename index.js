const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { firestore } = require("firebase-admin");
const { info } = require("firebase-functions/logger");

const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51Nd5QbEIkYjT8UeQyPPTLNiwasFikJu3mwE6KBZ9oZLvtmYHhphKhdjkXU7Apn3GsXWXRAjpzBJO2vxJq0UG0gvC00QxKx5mty"
);
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.get("/", (resquest, response) => response.status(200).send("hello world"));
app.post("/payments/create", async (request, response) => {
  const total = request.query.total;
  if (total > 0) {
    console.log("Payment Request Recieved for this amount >>> ", total);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total, // subunits of the currency
      currency: "usd",
    });

    // OK - Created
    response.status(201).send({
      clientSecret: paymentIntent.client_secret,
    });
  } else {
    response.status(201).send({
      message: "can not process payment",
    });
  }
});

exports.api = functions.https.onRequest(app);
