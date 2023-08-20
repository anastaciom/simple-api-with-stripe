import { Router } from "express";
import { LoginController } from "../../controllers/login-controller";

const login = Router();

login.post("/sign-in", LoginController.handle);

export { login };
