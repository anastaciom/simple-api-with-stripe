import { Request, Response } from "express";
import { InternalServerError } from "../errors/InternalServerError";
import { PrismaClient } from "../services/prismaClient";
import { PlanDto } from "../dtos/Plan-dto";

export class SubscriptionController {
  static async getPlans(_: Request, res: Response) {
    try {
      const allPlans = await PrismaClient.getInstance().subscriptions.findMany({
        where: { is_active: true },
      });

      const data = allPlans.map(
        (plan) =>
          new PlanDto({
            description: plan.description ?? "",
            id: plan.id,
            isActive: plan.is_active,
            name: plan.name,
            price: Number(plan.price),
            priceId: plan.price_id_stripe,
            themeColor: plan.theme_color,
            typeOfCharge: plan.type_of_charge,
          }).get
      );

      return res.json(data);
    } catch (_) {
      return res.status(500).json({ error: new InternalServerError().message });
    }
  }
}
