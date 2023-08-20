import { CookieOptions } from "express";

export const cookieConfigData: CookieOptions = {
  httpOnly: true, // Prevents XXS
  secure: process.env.NODE_ENV === "production", // HTTPS in production
  sameSite: "strict", // Prevents CSRF
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
