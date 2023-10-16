import { NextFunction, Request, Response } from "express";
import { JwtService } from "../../services/jwt";
import { PrismaClient } from "../../services/prismaClient";
import { JwtPayload } from "jsonwebtoken";

export class CheckToken {
  static async check(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Token não foi fornecido." });
    }

    const parts = authHeader.split(" ");

    if (!(parts.length === 2)) {
      return res.status(401).json({ error: "Erro no token." });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ error: "Token mal formatado." });
    }

    const response = JwtService.verifyToken({
      token,
      secret: process.env.ACCESS_TOKEN_SECRET!,
    });

    if (response instanceof Error) {
      return res.status(401).json({ error: response.message });
    }

    const payload = response as JwtPayload;

    const user = await PrismaClient.getInstance().user.findUnique({
      where: { id: payload.userId as string },
    });

    if (user?.token_version !== payload.tokenVersion) {
      return res.status(401).json({ error: "Token Inválido." });
    }

    (req as any).userData = response;

    return next();
  }
}
