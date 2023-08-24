import { Router } from "express";

import { SubscriptionController } from "../../controllers/subscription-controller";
import { CheckToken } from "../middlewares/checkToken";

const subscriptionRoutes = Router();

subscriptionRoutes.get(
  "/plans",
  CheckToken.check,
  SubscriptionController.getPlans
);

export { subscriptionRoutes };
