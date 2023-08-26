import Stripe from "stripe";
import { PrismaClient } from "../prismaClient";
import { handleProductUpdated } from "./events/productUpdated";
import { subscriptionCreated } from "./events/subscriptionCreated";

const handleWebhookEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case "product.updated":
      return handleProductUpdated(event);

    case "customer.subscription.created":
      return subscriptionCreated(event);
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
};

export { handleWebhookEvent };
