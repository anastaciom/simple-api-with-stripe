import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { cookieConfigData } from "../config/cookie";
import { PrismaClient } from "../services/prismaClient";
import { JwtService } from "../services/jwt";

export class LogoutController {
  static async handle(req: Request, res: Response) {
    const { cookies } = req;

    if (!cookies?.token) {
      return res.sendStatus(204);
    }

    const token = JwtService.decodeToken({
      token: cookies.token,
      options: { json: true },
    }) as JwtPayload | null;

    if (token) {
      await PrismaClient.getInstance().user.update({
        where: { id: token.userId },
        data: { token_version: { increment: 1 } },
      });

      res.clearCookie("token", cookieConfigData);
      res.json({ success: "Cookie limpo." });
    }
  }
}
