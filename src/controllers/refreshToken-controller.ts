import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../services/prismaClient";
import "dotenv/config";
import { generateAccessOrRefreshToken } from "../utils/generateToken";

export class RefreshTokenController {
  static async handle(req: Request, res: Response) {
    const { cookies } = req;

    if (!cookies.token) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    try {
      jwt.verify(
        cookies.token,
        process.env.REFRESH_TOKEN_SECRET!,
        async (err: any, decoded: any) => {
          if (err) {
            return res.status(403).json({ error: "Forbidden." });
          }
          const user = await PrismaClient.getInstance().user.findUnique({
            where: { id: decoded.userId },
          });

          if (!user) {
            return res.status(401).json({ error: "Unauthorized." });
          }

          const accessToken = generateAccessOrRefreshToken(
            "access_token",
            user.id
          );

          return res.json({ accessToken });
        }
      );
    } catch (_) {
      return res.status(500).json({ error: "Internal Server Error." });
    }
  }
}
