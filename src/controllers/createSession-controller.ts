import "dotenv/config";
import { Request, Response } from "express";
import { stripe } from "../services/stripe";

export class SessionController {
  static async createSession(req: Request, res: Response) {
    try {
      const { priceId } = req.body;

      const createSession = await stripe.checkout.sessions.create(
        {
          //-------------------------
          // customer_email: "USEREMAIL@TEST.COM",
          // currency: "USD" OR "BRL", // REMEMBER: WHEN CREATING THE SUBSCRIPTION ON STRIPE, YOU NEED
          // TO SET UP TO RECEIVE PAYMENTS IN BOTH CURRENCIES.
          // customer_email and currency: WILL BE DYNAMIC DATA
          //-------------------------
          mode: "subscription",
          payment_method_types: ["card"],
          line_items: [{ price: priceId, quantity: 1 }],
          success_url: process.env.SUCCESS_URL as string,
          cancel_url: process.env.CANCEL_URL as string,
        },
        { apiKey: process.env.SECRET_KEY_STRIPE }
      );

      return res.json(createSession);
    } catch (_) {
      return res.status(500).json({ error: "Internal Server Error." });
    }
  }
}
