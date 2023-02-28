import React, { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import {
  PaymentElement,
  LinkAuthenticationElement,
} from "@stripe/react-stripe-js";
import "../App.css";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3001",
      },
      redirect: "if_required",
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded"){
      setMessage("Payment status:" + paymentIntent.status + "🎉");
    } else {
        setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">{isLoading ? "Processing..." : "Pay now"}</span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
