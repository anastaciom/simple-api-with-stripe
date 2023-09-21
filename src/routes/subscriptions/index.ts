import { Router } from "express";

import { SubscriptionController } from "../../controllers/subscription-controller";
import { CheckToken } from "../middlewares/checkToken";
import { checkPermission } from "../middlewares/checkPermissions";

const subscriptionRoutes = Router();

subscriptionRoutes.get(
  "/plans",
  CheckToken.check,
  // checkPermission(["FAVORITE_PHOTO", "LIST_ALL_RESULTS"]), //TODO: ADJUST LATER
  SubscriptionController.getPlans
);

export { subscriptionRoutes };
