import Stripe from "stripe";
import { PrismaClient } from "../../../prismaClient";

type UpdateData = {
  [key: string]: any;
  theme_color?: string;
};

type EventData = {
  object: {
    default_price: string;
    [key: string]: any;
  };
};

type TData = EventData & Stripe.Event.Data;

const handleProductUpdated = async (event: Stripe.Event) => {
  const { object, previous_attributes } = event.data as TData;

  const fieldMap: Record<string, string> = {
    active: "is_active",
  };

  if (!previous_attributes) {
    return;
  }

  let updateData: UpdateData = {};

  for (let field of Object.keys(previous_attributes)) {
    if (
      field !== "updated" &&
      field !== "metadata" &&
      object.hasOwnProperty(field)
    ) {
      const mappedField = fieldMap[field] || field;
      updateData[mappedField] = object[field];
    } else if (field === "metadata") {
      updateData.theme_color = object[field].color_name;
    }
  }

  try {
    await PrismaClient.getInstance().subscriptions.update({
      where: { price_id_stripe: object.default_price },
      data: updateData,
    });
  } catch (error) {
    return error;
  }
};

export { handleProductUpdated };
