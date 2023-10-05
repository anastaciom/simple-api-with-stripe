import { Request, Response } from "express";
import { PrismaClient } from "../services/prismaClient";
import { InternalServerError } from "../errors/InternalServerError";
import { UserDataDto } from "../dtos/UserData-dto";
import { Redis } from "../infra/db/redis/setup";

export class MeController {
  static async handle(req: Request, res: Response) {
    const redisClient = Redis.getInstance().getClient();
    const id = (req as any).userData.userId;
    const cachedUserData = await redisClient?.get(id);

    if (cachedUserData) {
      return res.json(JSON.parse(cachedUserData));
    }

    try {
      const user = await PrismaClient.getInstance().user.findUnique({
        where: { id },
        select: {
          name: true,
          email: true,
          avatar_url: true,
          UserRole: {
            select: {
              role: {
                select: {
                  name: true,
                },
              },
            },
          },
          UserSubscriptions: {
            where: { is_active: true },
            select: {
              subscription: {
                select: { name: true },
              },
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({
          error: new InternalServerError("Usuário não encontrado.").message,
        });
      }

      const { email, name, UserRole, UserSubscriptions, avatar_url } = user;

      const userData = new UserDataDto({
        avatarUrl: avatar_url,
        email,
        name,
        authorizations: UserRole.map((userRole) => userRole.role.name),
        subscription: !!UserSubscriptions.length
          ? UserSubscriptions[0].subscription.name
          : null,
      }).get;

      await redisClient?.set(id, JSON.stringify(userData), { EX: 86400 }); //EX: 1 DIA;
      res.json(userData);
    } catch (error) {
      res.status(500).json({ error: new InternalServerError().message });
    }
  }
}
