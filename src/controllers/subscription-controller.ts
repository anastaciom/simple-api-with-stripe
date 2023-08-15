import { Request, Response } from "express";
import { stripe } from "../services/stripe";
import { setPrices } from "../utils/setPrices";

export class SubscriptionController {
  static async getPlans(req: Request, res: Response) {
    try {
      const { data: response } = await stripe.products.list({
        apiKey: process.env.SECRET_KEY_STRIPE,
      });

      const addPriceInProduct = response.map((data) => ({
        ...data,
        price: setPrices(data.name),
      }));

      return res.json(addPriceInProduct);
    } catch (_) {
      return res.status(500).json({ error: "Internal Server Error." });
    }
  }
}
