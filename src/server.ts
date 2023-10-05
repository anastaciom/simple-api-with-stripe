import "dotenv/config";
import express, { raw, Application } from "express";
import { routes } from "./routes";
import cors from "cors";
import { webhookRoute } from "./routes/webhookStripe";
import cookieParser from "cookie-parser";
import { Redis } from "./infra/db/redis/setup";
export class Server {
  private app: Application;
  private readonly baseUrl: string = "/api";
  private readonly PORT: string | number = process.env.PORT ?? 3030;

  constructor() {
    this.app = express();
    this.startRedisDb();
    this.middlewares();
    this.routes();
    this.listen();
  }

  private async startRedisDb() {
    const redis = Redis.getInstance();
    redis.initialize(process.env.REDIS_URL);
    await redis.connect();
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
