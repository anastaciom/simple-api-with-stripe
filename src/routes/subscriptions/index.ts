import { Request, Response, Router } from "express";
import { stripe } from "../../services/stripe";
import { setPrices } from "../../utils/setPrices";
import { SubscriptionController } from "../../controllers/subscription-controller";
import { CheckToken } from "../middlewares/checkToken";

const subscriptionRoutes = Router();

subscriptionRoutes.get(
  "/plans",
  CheckToken.check,
  SubscriptionController.getPlans
);

export { subscriptionRoutes };
