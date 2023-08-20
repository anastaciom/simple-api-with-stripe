import { sign, verify } from "jsonwebtoken";
import { InternalServerError } from "../errors/InternalServerError";

export class JwtService {
  private secret: string = "";

  constructor(secret: string) {
    this.secret = secret;
  }

  createToken = (data: object, expiresIn: number | string) => {
    if (!this.secret) {
      return new Error("Error creating token.");
    }

    if (!Object.keys(data).length) {
      return new Error("Data object cannot be empty.");
    }

    const token = sign(data, this.secret, { expiresIn });

    return token;
  };

  verifyToken = (token: string) => {
    if (this.secret) {
      try {
        return verify(token, this.secret);
      } catch (_) {
        new InternalServerError().message;
      }
    }

    return new Error("Error verifying token.");
  };
}
