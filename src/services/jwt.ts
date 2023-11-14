import { sign, verify, decode } from "jsonwebtoken";
import { InternalServerError } from "../errors/InternalServerError";
import { RefreshTokenFlags } from "../errors/EnumsRefreshToken";

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
          return new Error(
            JSON.stringify({
              status: 401,
              error: "Token inválido.",
              flag: RefreshTokenFlags.NO_REFRESH_TOKEN,
            })
          );
        } else if (err.message === "jwt expired") {
          return new Error(
            JSON.stringify({
              status: 401,
              error: "Token Expirado.",
            })
          );
        }

        return new Error(
          JSON.stringify({
            status: 401,
            error: "Erro ao verificar o token.",
            flag: RefreshTokenFlags.NO_REFRESH_TOKEN,
          })
        );
      }
    }

    new Error(
      JSON.stringify({
        status: 500,
        error: new InternalServerError().message,
        flag: RefreshTokenFlags.NO_REFRESH_TOKEN,
      })
    );
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
