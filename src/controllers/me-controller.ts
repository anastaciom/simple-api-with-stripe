import { Request, Response } from "express";
import { PrismaClient } from "../services/prismaClient";
import { InternalServerError } from "../errors/InternalServerError";
import { UserDataDto } from "../dtos/UserData-dto";

export class MeController {
  static async handle(req: Request, res: Response) {
    const id = (req as any).userData.userId;

    try {
      const user = await PrismaClient.getInstance().user.findUnique({
        where: { id },
        select: {
          name: true,
          email: true,
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

      const { email, name, UserRole, UserSubscriptions } = user;

      const userData = new UserDataDto({
        email,
        name,
        authorizations: UserRole.map((userRole) => userRole.role.name),
        subscription: !!UserSubscriptions.length
          ? UserSubscriptions[0].subscription.name
          : null,
      }).get;

      res.json(userData);
    } catch (error) {
      res.status(500).json({ error: new InternalServerError().message });
    }
  }
}
