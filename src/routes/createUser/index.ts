import { Router } from "express";
import { CreateUserController } from "../../controllers/createUser-controller";

const createUser = Router();

createUser.post("/sign-up", CreateUserController.handle);

export { createUser };
