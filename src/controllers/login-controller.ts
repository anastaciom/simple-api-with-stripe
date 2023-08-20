import "dotenv/config";
import { Request, Response } from "express";
import { validate } from "class-validator";
import { PrismaClient } from "../services/prismaClient";
import { EncrypterService } from "../services/encrypter";
import { generateAccessOrRefreshToken } from "../utils/generateToken";
import { LoginUserDto } from "../dtos/LoginUser-dto";
import { cookieConfigData } from "../config/cookie";
import { InternalServerError } from "../errors/InternalServerError";

export class LoginController {
  static async handle(req: Request, res: Response) {
    const userDto = new LoginUserDto(req.body);
    const errors = await validate(userDto);

    if (!!errors.length) {
      const validationErrors = errors
        .map((error) => Object.values(error.constraints!))
        .flat();

      return res.status(400).json({ errors: validationErrors });
    }

    try {
      const userData = await PrismaClient.getInstance().user.findUnique({
        where: { email: userDto.email },
      });

      if (!userData) {
        return res.status(400).json({
          error: "E-mail ou senha incorretos.",
        });
      }

      const descrypter = await new EncrypterService().compare(
        userDto.password,
        userData.password
      );

      if (!descrypter) {
        return res.status(400).json({
          error: "E-mail ou senha incorretos.",
        });
      }

      const accessToken = generateAccessOrRefreshToken(
        "access_token",
        userData.id
      );
      const refreshToken = generateAccessOrRefreshToken(
        "refresh_token",
        userData.id
      );

      res.cookie("token", refreshToken, cookieConfigData);
      res.status(200).send({ accessToken });
    } catch (_) {
      res.status(500).json({ error: new InternalServerError().message });
    }
  }
}
