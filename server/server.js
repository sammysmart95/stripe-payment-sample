const express = require("express");
const app = express();
const {resolve} = require("path");
// This is your test secret API key.
const env = require("dotenv").config({path: "./.env"});

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01"
});

app.use(express.static(process.env.STATIC_DIR));
app.use(express.json());

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

app.get("/", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/index.html")
  res.sendFile(path);
});

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  })
});

app.post("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "usd",
      amount: 1400,
      automatic_payment_methods: {
        enabled: true,
      },
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log('message', error.message)
    return res.status(400).send({
      error: {
        message: error.message
      }
    })
  }

});

app.listen(4242, () => console.log("Node server listening on port 4242!"));