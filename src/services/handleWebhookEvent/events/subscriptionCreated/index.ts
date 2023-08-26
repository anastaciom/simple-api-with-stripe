import Stripe from "stripe";
import { PrismaClient } from "../../../prismaClient";

const subscriptionCreated = async (event: Stripe.Event) => {
  const { customer, current_period_start, current_period_end, plan } = event
    .data.object as Stripe.Subscription;
  const currentPeriodStart = new Date(current_period_start * 1000);
  const currentPeriodEnd = new Date(current_period_end * 1000);

  const user = await PrismaClient.getInstance().user.findUnique({
    where: {
      stripe_customer_id: customer as string,
    },
  });

  const subscription =
    await PrismaClient.getInstance().subscriptions.findUnique({
      where: { price_id_stripe: plan.id },
    });

  if (user && subscription) {
    try {
      await PrismaClient.getInstance().userSubscriptions.create({
        data: {
          user_id: user.id,
          registration_date: currentPeriodStart,
          expires_at: currentPeriodEnd,
          user_stripe_customer_id: user.stripe_customer_id as string,
          subscription_id: subscription.id,
        },
      });
    } catch (error) {
      return error;
    }
  }
};

export { subscriptionCreated };
