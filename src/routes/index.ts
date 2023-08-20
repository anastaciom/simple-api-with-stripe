import { sessionRoutes } from "./createSession";
import { createUser } from "./createUser";
import { login } from "./login";
import { refreshToken } from "./refreshToken";
import { subscriptionRoutes } from "./subscriptions";

const routes = [
  refreshToken,
  subscriptionRoutes,
  sessionRoutes,
  createUser,
  login,
];

export { routes };
