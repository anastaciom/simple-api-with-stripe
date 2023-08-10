import "dotenv/config";
import express, { raw } from "express";
import { routes } from "./routes";
import cors from "cors";
import { webhookRoute } from "./routes/webhookStripe";

const app = express();
const baseUrl = "/api";
const PORT = process.env.PORT ?? 3030;

app.use(cors({ origin: process.env.ORIGIN }));
app.use(
  `${baseUrl}/webhook-stripe`,
  raw({ type: "application/json" }), //Placed above express.json due to the different format sent by Stripe
  webhookRoute
);
app.use(express.json());
app.use(baseUrl, routes);

app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}...`);
});
