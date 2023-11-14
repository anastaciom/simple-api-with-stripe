import axios from "axios";
import { Request, Response } from "express";
import { InternalServerError } from "../errors/InternalServerError";
import { ImageDto } from "../dtos/Image-dto";
import { PrismaClient } from "../services/prismaClient";

export class SearchImagesController {
  static async handle(req: Request, res: Response) {
    const id = (req as any).userData.userId;

    const getRole = await PrismaClient.getInstance().user.findUnique({
      where: { id },
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

    const checkPermisson = getRole?.UserRole.flatMap(
      (userRole) => userRole.role.permissions
    ).some((data) => data.name === "LIMIT_RESULT");

    if (Number(req.query?.page) > 1 && checkPermisson) {
      return res.status(403).json({
        error:
          "A assinatura atual limita o acesso a um conjunto específico de imagens. Para visualizar mais, por favor, considere fazer um upgrade de assinatura.",
      });
    }

    try {
      const query = Object.entries(req.query)
        .map((item) => `${item[0]}=${item[1]?.toString().replace(" ", "+")}`)
        .join("&");

      const { data } = await axios.get(
        `https://pixabay.com/api/?key=${process.env.API_KEY_PIXABAY}&${query}&image_type=photo&min_height=640&orientation=vertical&safesearch=true`
      );

      const images = data.hits.map(
        (item: any) =>
          new ImageDto({
            id: item.id,
            imageType: item.type,
            imageUrl: item.webformatURL,
            userName: item.user,
            userPhoto: item.userImageURL,
            views: item.views,
            heigth: item.webformatHeight,
            width: item.webformatWidth,
          })
      );

      res.json(images);
    } catch (error) {
      res.status(500).json({
        error: new InternalServerError(
          "Erro na busca das imagens. Aguarde alguns segundos e tente novamente"
        ).message,
      });
    }
  }
}
