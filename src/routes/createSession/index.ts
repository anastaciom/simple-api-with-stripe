import "dotenv/config";
import { Router } from "express";
import { SessionController } from "../../controllers/createSession-controller";
import { CheckToken } from "../middlewares/checkToken";

const sessionRoutes = Router();

sessionRoutes.post(
  "/session",
  CheckToken.check,
  SessionController.createSession
);

export { sessionRoutes };
