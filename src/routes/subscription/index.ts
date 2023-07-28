import { Request, Response, Router } from "express";

const subscriptionRoutes = Router();

subscriptionRoutes.get("/plans", async (req: Request, res: Response) => {
  res.send({ message: "OK" });
});

export { subscriptionRoutes };
