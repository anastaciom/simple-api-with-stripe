import { CookieOptions } from "express";

export const cookieConfigData: CookieOptions = {
  httpOnly: true, // Prevents XXS
  secure: process.env.NODE_ENV === "production", // HTTPS in production
  sameSite: "strict", // Prevents CSRF
};
