import "dotenv/config";
import express, { raw, Application } from "express";
import { routes } from "./routes";
import cors from "cors";
import { webhookRoute } from "./routes/webhookStripe";
import cookieParser from "cookie-parser";
export class Server {
  private app: Application;
  private readonly baseUrl: string = "/api";
  private readonly PORT: string | number = process.env.PORT ?? 3030;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    this.listen();
  }

  private middlewares(): void {
    this.app.use(cors({ origin: process.env.ORIGIN, credentials: true }));

    // Placed above express.json due to the different format sent by Stripe
    this.app.use(
      `${this.baseUrl}/webhook-stripe`,
      raw({ type: "application/json" }),
      webhookRoute
    );
    this.app.use(cookieParser());
    this.app.use(express.json());
  }

  private routes(): void {
    this.app.use(this.baseUrl, routes);
  }

  private listen(): void {
    this.app.listen(this.PORT, () => {
      console.log(`Server running in port ${this.PORT}...`);
    });
  }
}

new Server();
