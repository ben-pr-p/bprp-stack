import { config } from "@/lib/config";
import { Kysely, PostgresDialect, WithSchemaPlugin } from "kysely";
import { getPool } from "./pg";
import { idempotentlyRunSeedsWithinProcess } from "./seeds";
import type Database from "./types/Database";

export const SCHEMA = "widgets";

export async function getKysely({ runSeeds = config.isDev }: { runSeeds?: boolean } = {}) {
  const { pool } = await getPool();

  const db = new Kysely<Database>({
    plugins: [new WithSchemaPlugin(SCHEMA)],
    dialect: new PostgresDialect({
      pool,
    }),
  });

  if (runSeeds) {
    await idempotentlyRunSeedsWithinProcess(db);
  }

  return db;
}
