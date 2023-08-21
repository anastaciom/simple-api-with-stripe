import { sessionRoutes } from "./createSession";
import { createUser } from "./createUser";
import { login } from "./login";
import { logout } from "./logout";
import { refreshToken } from "./refreshToken";
import { subscriptionRoutes } from "./subscriptions";

const routes = [
  refreshToken,
  subscriptionRoutes,
  sessionRoutes,
  createUser,
  login,
  logout,
];

export { routes };
