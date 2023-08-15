import { Request, Response } from "express";

import Stripe from "stripe";
import { stripe } from "../services/stripe";

export class WebhookStripeController {
  static async handleWebhook(req: Request, res: Response) {
    const stripeSignature = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeSignature) {
      return res
        .status(500)
        .json({ error: "Webhook signature invalid or expired." });
    }

    if (!webhookSecret) {
      return res.status(500).json({ error: "Internal Server Error." });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        stripeSignature,
        webhookSecret
      );
    } catch (err: any) {
      res.status(400).send({ error: "Webhook Internal Error." });
      return;
    }
    console.log(event.type, "EVENT TYPE");

    // Handle the event
    // switch (event.type) {
    //   case "payment_intent.succeeded":
    //     const paymentIntentSucceeded = event.data.object;
    //     // Then define and call a function to handle the event payment_intent.succeeded
    //     break;
    //   // ... handle other event types
    //   default:
    //     console.log(`Unhandled event type ${event.type}`);
    // }

    res.send().end();
  }
}
