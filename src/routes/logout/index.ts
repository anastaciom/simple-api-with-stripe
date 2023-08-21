import { Router } from "express";
import { LogoutController } from "../../controllers/logout-controller";

const logout = Router();

logout.get("/sign-out", LogoutController.handle);

export { logout };
