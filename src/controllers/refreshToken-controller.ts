import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "../services/prismaClient";
import { generateAccessOrRefreshToken } from "../utils/generateToken";
import { InternalServerError } from "../errors/InternalServerError";
import { JwtService } from "../services/jwt";

export class RefreshTokenController {
  static async handle(req: Request, res: Response) {
    const { cookies } = req;

    if (!cookies.refresh_token) {
      return res.status(401).json({ error: "Não autorizado." });
    }

    try {
      jwt.verify(
        cookies.refresh_token,
        process.env.REFRESH_TOKEN_SECRET!,
        async (err: any, decoded: any) => {
          if (err) {
            const errors = [
              "jwt malformed",
              "invalid signature",
              "Unexpected",
              "invalid algorithm",
              "invalid token",
            ];

            if (errors.some((el) => err.message.includes(el))) {
              return res.status(401).json({ error: "NO_REFRESH_TOKEN." });
            } else if (err.message === "jwt expired") {
              const prisma = PrismaClient.getInstance();
              const token = JwtService.decodeToken({
                token: cookies.refresh_token,
                options: { json: true },
              }) as JwtPayload | null;

              if (token) {
                await prisma.$executeRaw`UPDATE users SET token_version = CASE WHEN token_version = 0 THEN 1 ELSE 0 END WHERE id = ${token.userId}`;

                return res.status(401).json({ error: "Token Invalidado." });
              }
            } else {
              return res.status(403).json({ error: "Acesso negado." });
            }
          }

          const user = await PrismaClient.getInstance().user.findUnique({
            where: { id: decoded.userId },
          });

          if (!user) {
            return res.status(401).json({ error: "Não autorizado." });
          }

          if (user.token_version !== decoded.tokenVersion) {
            return res.status(401).json({ error: "Token inválido." });
          }

          const accessToken = generateAccessOrRefreshToken(
            "access_token",
            user.id,
            user.token_version
          );

          return res.json({ accessToken });
        }
      );
    } catch (_) {
      return res.status(500).json({ error: new InternalServerError().message });
    }
  }
}
