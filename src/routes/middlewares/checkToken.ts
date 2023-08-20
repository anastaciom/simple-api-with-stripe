import { NextFunction, Request, Response } from "express";
import { JwtService } from "../../services/jwt";
import "dotenv/config";

export class CheckToken {
  static check(req: Request, res: Response, next: NextFunction) {
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

    const response = new JwtService(
      process.env.ACCESS_TOKEN_SECRET!
    ).verifyToken(token);

    if (response instanceof Error) {
      return res.status(401).json({ error: response.message });
    }

    (req as any).userData = response;

    return next();
  }
}
