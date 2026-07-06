import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL ?? "";

// ponytail: single shared client. prepare:false is required for Supabase's
// transaction pooler; fine for serverless. Swap to per-request if pooling bites.
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
