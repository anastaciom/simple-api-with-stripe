import "dotenv/config";
import { Request, Response } from "express";
import { validate } from "class-validator";
import { PrismaClient } from "../services/prismaClient";
import { EncrypterService } from "../services/encrypter";
import { CreateUserDto } from "../dtos/CreateUser-dto";
import { generateAccessOrRefreshToken } from "../utils/generateToken";

export class UserController {
  static async signUp(req: Request, res: Response) {
    const userDto = new CreateUserDto(req.body);
    const errors = await validate(userDto);

    if (!!errors.length) {
      const validationErrors = errors
        .map((error) => Object.values(error.constraints!))
        .flat();
      return res.status(400).json({ errors: validationErrors });
    }

    try {
      const existingUser = await PrismaClient.getInstance().user.findUnique({
        where: { email: userDto.email },
      });

      if (existingUser) {
        return res.status(400).json({ error: "Email já em uso." });
      }

      const { id } = await PrismaClient.getInstance().user.create({
        data: {
          ...userDto,
          password: await new EncrypterService().encrypt(userDto.password),
        },
      });

      const accessToken = generateAccessOrRefreshToken("access_token", id);
      const refreshToken = generateAccessOrRefreshToken("refresh_token", id);

      res.cookie("token", refreshToken, {
        httpOnly: true, // Prevents XXS
        secure: process.env.NODE_ENV === "production", // HTTPS in production
        sameSite: "strict", // Prevents CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).send({ accessToken });
    } catch (_) {
      res.status(500).json({ error: "Internal Server Error." });
    }
  }
}
