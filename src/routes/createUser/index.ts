import { Router } from "express";
import { UserController } from "../../controllers/createUser-controller";

const createUser = Router();

createUser.post("/sign-up", UserController.signUp);

export { createUser };
