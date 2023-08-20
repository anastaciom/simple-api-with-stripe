import "dotenv/config";
import { Router } from "express";
import { WebhookStripeController } from "../../controllers/webhookStripe-controller";

const webhookRoute = Router();

webhookRoute.post("/", WebhookStripeController.handle);

export { webhookRoute };
