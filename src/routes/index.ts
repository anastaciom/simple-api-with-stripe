import { sessionRoutes } from "./createSession";
import { createUser } from "./createUser";
import { subscriptionRoutes } from "./subscriptions";

const routes = [subscriptionRoutes, sessionRoutes, createUser];

export { routes };
