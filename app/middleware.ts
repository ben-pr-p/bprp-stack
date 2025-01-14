import { getKysely } from "@/database/db";
import { createMiddleware } from "@tanstack/start";

export const withDatabase = createMiddleware().server(async ({ next }) => {
  const db = await getKysely();
  return next({ context: { db } });
});
