import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../services/prismaClient";
import { InternalServerError } from "../../errors/InternalServerError";

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

export const checkPermission = (permissionsRequired: string[]): Middleware => {
  if (!permissionsRequired || !permissionsRequired.length) {
    throw new InternalServerError("No permissions specified.");
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userData.userId;

      const permissions = await PrismaClient.getInstance().user.findUnique({
        where: { id: userId },
        select: {
          UserRole: {
            select: {
              role: {
                select: {
                  permissions: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!permissions) {
        return res.status(404).json({ error: "Usuario não encontrado." });
      }

      const userPermissions = permissions.UserRole.flatMap((userRole) =>
        userRole.role.permissions.map((permission) => permission.name)
      );

      if (
        permissionsRequired.some((permission) =>
          userPermissions.includes(permission)
        )
      ) {
        return next();
      } else {
        return res.status(403).json({ error: "Você não tem acesso." });
      }
    } catch (error) {
      return res.status(500).json({ error: new InternalServerError().message });
    }
  };
};
