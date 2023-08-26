import { Request, Response } from "express";
import Stripe from "stripe";
import { stripe } from "../services/stripe";
import { InternalServerError } from "../errors/InternalServerError";
import { handleWebhookEvent } from "../services/handleWebhookEvent";

export class WebhookStripeController {
  static async handle(req: Request, res: Response) {
    const stripeSignature = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeSignature) {
      return res
        .status(500)
        .json({ error: "Webhook signature invalid or expired." });
    }

    if (!webhookSecret) {
      return res.status(500).json({ error: new InternalServerError().message });
    }

    try {
      const event: Stripe.Event = stripe.webhooks.constructEvent(
        req.body,
        stripeSignature,
        webhookSecret
      );

      await handleWebhookEvent(event);
      res.send().end();
    } catch (err: any) {
      res.status(500).send({
        error: new InternalServerError("Erro interno no Webhook.").message,
      });
    }
  }
}
