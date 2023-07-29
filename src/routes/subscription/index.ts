import { Request, Response, Router } from "express";
import { stripe } from "../../services/stripe";

const subscriptionRoutes = Router();

subscriptionRoutes.get("/plans", async (req: Request, res: Response) => {
  const prices = await stripe.prices.list({
    apiKey: process.env.SECRET_KEY_STRIPE,
  });

  return res.json(prices);
});

export { subscriptionRoutes };
