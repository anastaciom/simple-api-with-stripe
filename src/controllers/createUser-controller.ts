import { Request, Response } from "express";
import { validate } from "class-validator";
import { PrismaClient } from "../services/prismaClient";
import { EncrypterService } from "../services/encrypter";
import { CreateUserDto } from "../dtos/CreateUser-dto";
import { generateAccessOrRefreshToken } from "../utils/generateToken";
import { cookieConfigData } from "../config/cookie";
import { InternalServerError } from "../errors/InternalServerError";
import { stripe } from "../services/stripe";

export class CreateUserController {
  static async handle(req: Request, res: Response) {
    const userDto = new CreateUserDto(req.body);
    const errors = await validate(userDto);

    if (!!errors.length) {
      const validationErrors = errors.flatMap((error) =>
        Object.values(error.constraints!)
      );

      return res.status(400).json({ errors: validationErrors });
    }

    try {
      const existingUser = await PrismaClient.getInstance().user.findUnique({
        where: { email: userDto.email },
      });

      if (existingUser) {
        return res.status(409).json({ error: "Email já em uso." });
      }

      const { id, email, name, token_version } =
        await PrismaClient.getInstance().user.create({
          data: {
            ...userDto,
            password: await new EncrypterService().encrypt(userDto.password),
          },
        });

      //TODO:IN A REAL SYSTEM, YOU MUST SEND A VERIFICATION
      //EMAIL TO THE USER BEFORE CREATING THE CLIENT IN THE "STRIPE API"

      const existingCustomers = await stripe.customers.list({
        email,
        limit: 1,
      });

      let stripeCustomerId: string;

      if (!!existingCustomers.data.length) {
        stripeCustomerId = existingCustomers.data[0].id;
      } else {
        const { id: customerId } = await stripe.customers.create({
          email,
          name,
        });

        stripeCustomerId = customerId;
      }

      await PrismaClient.getInstance().user.update({
        where: { email },
        data: { stripe_customer_id: stripeCustomerId },
      });

      const accessToken = generateAccessOrRefreshToken(
        "access_token",
        id,
        token_version
      );
      const refreshToken = generateAccessOrRefreshToken(
        "refresh_token",
        id,
        token_version
      );

      res.cookie("refresh_token", refreshToken, {
        ...cookieConfigData,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.status(201).send({ accessToken });
    } catch (_) {
      res.status(500).json({ error: new InternalServerError().message });
    }
  }
}
