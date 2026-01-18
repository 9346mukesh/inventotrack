import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/index.css";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Elements stripe={stripePromise}>
            <App />
          </Elements>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);