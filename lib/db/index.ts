import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * Database Connection Utility
 * 
 * Uses Neon Serverless (HTTP) to connect to Postgres.
 * The schema is imported here to enable typed queries throughout the app.
 */

if (!process.env.DATABASE_URL) {
  console.error("[DB] Fatal: DATABASE_URL is not set.");
  throw new Error('DATABASE_URL is not defined in environment variables');
}

// Initializing the Neon SQL client
const sql = neon(process.env.DATABASE_URL);

// Exporting the Drizzle instance with the schema context
export const db = drizzle(sql, { schema });

console.log("[DB] Drizzle ORM initialized successfully.");

