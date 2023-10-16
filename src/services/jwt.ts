import { sign, verify, decode } from "jsonwebtoken";
import { InternalServerError } from "../errors/InternalServerError";

export class JwtService {
  private constructor() {}

  static createToken = ({
    data,
    expiresIn,
    secret,
  }: {
    data: object;
    expiresIn: number | string;
    secret: string;
  }) => {
    if (!secret) {
      return new Error("Error ao criar o token.");
    }

    if (!Object.keys(data).length) {
      return new Error("Data object cannot be empty.");
    }

    const token = sign(data, secret, { expiresIn });

    return token;
  };

  static verifyToken = ({
    token,
    secret,
  }: {
    token: string;
    secret: string;
  }) => {
    if (secret) {
      try {
        return verify(token, secret);
      } catch (err: any) {
        const errors = [
          "jwt malformed",
          "invalid signature",
          "Unexpected",
          "invalid algorithm",
          "invalid token",
        ];

        if (errors.some((el) => err.message.includes(el))) {
          return new Error("NO_REFRESH_TOKEN.");
        }

        return new Error("Erro ao verificar o token.");
      }
    }

    new InternalServerError().message;
  };

  static decodeToken = ({
    token,
    options,
  }: {
    token: string;
    options?: { json?: boolean; complete?: boolean };
  }) => {
    const decodedToken = decode(token, options);

    return decodedToken;
  };
}
