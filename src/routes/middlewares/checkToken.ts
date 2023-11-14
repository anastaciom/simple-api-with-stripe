import { NextFunction, Request, Response } from "express";
import { JwtService } from "../../services/jwt";
import { PrismaClient } from "../../services/prismaClient";
import { JwtPayload } from "jsonwebtoken";
import { RefreshTokenFlags } from "../../errors/EnumsRefreshToken";

export class CheckToken {
  static async check(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Token não foi fornecido.",
        flag: RefreshTokenFlags.NO_REFRESH_TOKEN,
      });
    }

    const parts = authHeader.split(" ");

    if (!(parts.length === 2)) {
      return res.status(401).json({
        error: "Erro no token.",
        flag: RefreshTokenFlags.NO_REFRESH_TOKEN,
      });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({
        error: "Token mal formatado.",
        flag: RefreshTokenFlags.NO_REFRESH_TOKEN,
      });
    }

    const response = JwtService.verifyToken({
      token,
      secret: process.env.ACCESS_TOKEN_SECRET!,
    });

    if (response instanceof Error) {
      const { status, ...rest } = JSON.parse(response.message);

      return res.status(status).json(rest);
    }

    const payload = response as JwtPayload;

    const user = await PrismaClient.getInstance().user.findUnique({
      where: { id: payload.userId as string },
    });

    if (user?.token_version !== payload.tokenVersion) {
      return res.status(401).json({
        error: "Token Inválido.",
        flag: RefreshTokenFlags.NO_REFRESH_TOKEN,
      });
    }

    (req as any).userData = response;

    return next();
  }
}
