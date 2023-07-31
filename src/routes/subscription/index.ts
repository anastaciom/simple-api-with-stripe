import { Request, Response, Router } from "express";
import { stripe } from "../../services/stripe";
import { setPrices } from "../../utils/setPrices";

const subscriptionRoutes = Router();

subscriptionRoutes.get("/plans", async (req: Request, res: Response) => {
  const { data: response } = await stripe.products.list({
    apiKey: process.env.SECRET_KEY_STRIPE,
  });

  const addPriceInProduct = response.map((data) => ({
    ...data,
    price: setPrices(data.name),
  }));

  return res.json(addPriceInProduct);
});

export { subscriptionRoutes };
