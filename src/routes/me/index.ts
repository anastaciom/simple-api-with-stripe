import { Router } from "express";
import { MeController } from "../../controllers/me-controller";
import { CheckToken } from "../middlewares/checkToken";

const me = Router();

me.get("/me", CheckToken.check, MeController.handle);

export { me };
