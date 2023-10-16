import { Request, Response } from "express";
import { cookieConfigData } from "../config/cookie";
import { PrismaClient } from "../services/prismaClient";
import jwt from "jsonwebtoken";
import { InternalServerError } from "../errors/InternalServerError";

export class LogoutController {
  static async handle(req: Request, res: Response) {
    const { cookies } = req;

    if (!cookies?.refresh_token) {
      return res.sendStatus(204);
    }

    try {
      jwt.verify(
        cookies.refresh_token,
        process.env.REFRESH_TOKEN_SECRET!,
        async (err: any, decoded: any) => {
          if (err) {
            return res.sendStatus(204);
          }

          await PrismaClient.getInstance().$executeRaw`
            UPDATE users
            SET token_version = CASE
            WHEN token_version >= 100 THEN 1
            ELSE token_version + 1
            END
            WHERE id = ${decoded.userId}`;

          res.clearCookie("refresh_token", cookieConfigData);
          return res.json({ success: "Cookie limpo." });
        }
      );
    } catch (error) {
      res.status(500).json({ error: new InternalServerError().message });
    }
  }
}
