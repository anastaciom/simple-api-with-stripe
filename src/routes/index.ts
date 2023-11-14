import { sessionRoutes } from "./createSession";
import { createUser } from "./createUser";
import { login } from "./login";
import { logout } from "./logout";
import { me } from "./me";
import { refreshToken } from "./refreshToken";
import { searchImages } from "./searchImages";
import { subscriptionRoutes } from "./subscriptions";

const routes = [
  refreshToken,
  subscriptionRoutes,
  sessionRoutes,
  createUser,
  login,
  logout,
  me,
  searchImages,
];

export { routes };
