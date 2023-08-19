import { Router } from "express";
import { RefreshTokenController } from "../../controllers/refreshToken-controller";

const refreshToken = Router();

refreshToken.get("/refresh-token", RefreshTokenController.handle);

export { refreshToken };
