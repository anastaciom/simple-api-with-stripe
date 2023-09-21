import "dotenv/config";
import { JwtService } from "../services/jwt";

const generateAccessOrRefreshToken = (
  type: "refresh_token" | "access_token",
  userId: string,
  tokenVersion: number
) => {
  switch (type) {
    case "refresh_token":
      return JwtService.createToken({
        data: { userId, tokenVersion },
        expiresIn: "7d",
        secret: process.env.REFRESH_TOKEN_SECRET!,
      });

    case "access_token":
      return JwtService.createToken({
        data: { userId, tokenVersion },
        expiresIn: "15m",
        secret: process.env.ACCESS_TOKEN_SECRET!,
      });

    default:
      return null;
  }
};

export { generateAccessOrRefreshToken };
