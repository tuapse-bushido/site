import { Pool } from 'pg';

/**
 * PostgreSQL connection pool.
 *
 * Uses environment variables for configuration:
 * - `DB_USER`
 * - `DB_DATABASE`
 * - `DB_PASSWORD`
 * - `DB_PORT`
 * - `DB_HOST`
 *
 * ---
 *
 * Подключение к PostgreSQL через пул соединений.
 *
 * Конфигурация берётся из переменных окружения:
 * - `DB_USER`
 * - `DB_DATABASE`
 * - `DB_PASSWORD`
 * - `DB_PORT`
 * - `DB_HOST`
 */
export const pool = new Pool({
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
});
