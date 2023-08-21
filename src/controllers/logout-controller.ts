import { Request, Response } from "express";
import { cookieConfigData } from "../config/cookie";

export class LogoutController {
  static async handle(req: Request, res: Response) {
    const { cookies } = req;

    if (!cookies?.token) {
      return res.sendStatus(204);
    }

    res.clearCookie("token", cookieConfigData);
    res.json({ success: "Cookie limpo." });
  }
}
