import { sessionRoutes } from "./createSession";
import { createUser } from "./createUser";
import { refreshToken } from "./refreshToken";
import { subscriptionRoutes } from "./subscriptions";

const routes = [subscriptionRoutes, sessionRoutes, createUser, refreshToken];

export { routes };
