import { Request, Response } from "express";
import axios from "axios";
import { InternalServerError } from "../errors/InternalServerError";
import { ImageDto } from "../dtos/Image-dto";

export class SearchPhotosController {
  static async handle(req: Request, res: Response) {
    const id = (req as any).userData.userId;
    //TODO: CHECK WHAT PERMISSION THE USER HAS,
    //BECAUSE IF THEY HAVE THE “LIST OF ALL”
    //THEY CAN ACCESS AND SWITCH TO ANY PAGE, OTHERWISE THEY CAN ONLY SEE PAGE 1.
    //IF THEY TRY TO CHANGE THE PAGE AND DO NOT HAVE THIS PERMISSION,
    //SEND A MESSAGE SOMETHING HOW: "Assine o plano Premium para ter acesso a mais fotos"

    const query = Object.entries(req.query)
      .map((item) => `${item[0]}=${item[1]?.toString().replace(" ", "+")}`)
      .join("&");

    try {
      const { data } = await axios.get(
        `https://pixabay.com/api/?key=${process.env.API_KEY_PIXABAY}&${query}&image_type=photo`
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
          })
      );

      res.json(images);
    } catch (error) {
      res.status(500).json({
        error: new InternalServerError(
          "Erro na busca das fotos. Aguarde alguns segundos e tente novamente"
        ).message,
      });
    }
  }
}
