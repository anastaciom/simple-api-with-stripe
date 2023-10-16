import Stripe from "stripe";

const stripe = new Stripe(process.env.SECRET_KEY_STRIPE as string, {
  apiVersion: "2022-11-15",
});

export { stripe };
