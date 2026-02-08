/**
 * Centralized Logging System
 *
 * Provides consistent logging across the application with different levels:
 * - DEBUG: Development details (only in dev mode)
 * - INFO: General information (mock data usage, etc.)
 * - WARN: Warnings (missing icons, deprecated features)
 * - ERROR: Errors (API failures, data issues)
 *
 * Usage:
 *   import { logger } from '@/lib/logger';
 *   logger.info('Profile', 'Using mock data', { id: 1 });
 *   logger.error('API', 'Fetch failed', error);
 */

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const LOG_LEVEL: LogLevel = IS_PRODUCTION ? "ERROR" : "DEBUG";

const LEVELS: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const shouldLog = (level: LogLevel): boolean => {
  return LEVELS[level] >= LEVELS[LOG_LEVEL];
};

export const logger = {
  /**
   * Debug logs - Only in development
   * Use for: Development details, verbose data inspection
   */
  debug: (module: string, message: string, data?: unknown): void => {
    if (shouldLog("DEBUG")) {
      console.log(`🔧 [${module}]`, message, data !== undefined ? data : "");
    }
  },

  /**
   * Info logs - General information
   * Use for: Mock data usage, successful operations, status updates
   */
  info: (module: string, message: string, data?: unknown): void => {
    if (shouldLog("INFO")) {
      console.info(`ℹ️  [${module}]`, message, data !== undefined ? data : "");
    }
  },

  /**
   * Warning logs - Things that need attention but aren't errors
   * Use for: Missing icons, deprecated features, fallback usage
   */
  warn: (module: string, message: string, data?: unknown): void => {
    if (shouldLog("WARN")) {
      console.warn(`⚠️  [${module}]`, message, data !== undefined ? data : "");
    }
  },

  /**
   * Error logs - Always shown, even in production
   * Use for: API failures, exceptions, critical issues
   */
  error: (module: string, message: string, error?: unknown): void => {
    if (shouldLog("ERROR")) {
      console.error(`🔴 [${module}]`, message, error);
    }
  },

  /**
   * Mock data indicator - Special case for mock mode
   * Shows when using mock data instead of real API
   */
  mock: (
    module: string,
    resource: string,
    details: Record<string, unknown> = {}
  ): void => {
    if (shouldLog("INFO")) {
      const detailsStr =
        Object.keys(details).length > 0
          ? `(${Object.entries(details)
              .map(([k, v]) => `${k}=${v}`)
              .join(", ")})`
          : "";
      console.info(
        `🧩 [${module}:MOCK]`,
        `Using mock data for ${resource}`,
        detailsStr
      );
    }
  },
};

export default logger;
