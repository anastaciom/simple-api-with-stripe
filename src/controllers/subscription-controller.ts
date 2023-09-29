import { Request, Response } from "express";
import { InternalServerError } from "../errors/InternalServerError";
import { PrismaClient } from "../services/prismaClient";
import { PlanDto } from "../dtos/Plan-dto";
import { stripe } from "../services/stripe";

export class SubscriptionController {
  static async getPlans(_: Request, res: Response) {
    const featuresListOfProduct = new Map();

    try {
      const getProduct = await stripe.products.list();
      const allPlans = await PrismaClient.getInstance().subscriptions.findMany({
        where: { is_active: true },
        orderBy: {
          price: "asc",
        },
      });

      getProduct.data.map((product) => {
        featuresListOfProduct.set(
          product.default_price,
          JSON.parse(product.metadata["items"])
        );
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
            featuresList: featuresListOfProduct.get(plan.price_id_stripe),
            typeOfCharge: plan.type_of_charge,
          }).get
      );

      return res.json(data);
    } catch (_) {
      console.log(_);
      return res.status(500).json({ error: new InternalServerError().message });
    }
  }
}
