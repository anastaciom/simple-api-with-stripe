import "dotenv/config";
import { JwtService } from "../services/jwt";

const generateAccessOrRefreshToken = (
  type: "refresh_token" | "access_token",
  userId: string
) => {
  switch (type) {
    case "refresh_token":
      return new JwtService(process.env.REFRESH_TOKEN_SECRET!).createToken(
        { userId },
        "7d"
      );

    case "access_token":
      return new JwtService(process.env.ACCESS_TOKEN_SECRET!).createToken(
        { userId },
        "15m"
      );

    default:
      return null;
  }
};

export { generateAccessOrRefreshToken };
