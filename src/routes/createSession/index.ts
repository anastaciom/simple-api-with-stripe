import "dotenv/config";
import { Router } from "express";
import { SessionController } from "../../controllers/createSession-controller";

const sessionRoutes = Router();

sessionRoutes.post("/session", SessionController.createSession);

export { sessionRoutes };
