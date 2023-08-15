import { Request, Response, Router } from "express";
import { stripe } from "../../services/stripe";
import { setPrices } from "../../utils/setPrices";
import { SubscriptionController } from "../../controllers/subscription-controller";

const subscriptionRoutes = Router();

subscriptionRoutes.get("/plans", SubscriptionController.getPlans);

export { subscriptionRoutes };
