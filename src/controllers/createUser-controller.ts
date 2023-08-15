import { Request, Response } from "express";
import { validate } from "class-validator";
import { PrismaClient } from "../services/prismaClient";
import { JwtService } from "../services/jwt";
import { EncrypterService } from "../services/encrypter";
import { CreateUserDto } from "../dtos/CreateUser-dto";

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
        return res.status(400).json({ error: "Email already in use." });
      }

      const { id } = await PrismaClient.getInstance().user.create({
        data: {
          ...userDto,
          password: await new EncrypterService().encrypt(userDto.password),
        },
      });

      const token = new JwtService().createToken({ userId: id }, 5000);

      res.status(201).json({ token });
    } catch (_) {
      res.status(500).json({ error: "Internal Server Error." });
    }
  }
}
