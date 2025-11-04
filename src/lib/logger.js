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

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const LOG_LEVEL = IS_PRODUCTION ? 'ERROR' : 'DEBUG';

const LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const shouldLog = (level) => {
  return LEVELS[level] >= LEVELS[LOG_LEVEL];
};

export const logger = {
  /**
   * Debug logs - Only in development
   * Use for: Development details, verbose data inspection
   */
  debug: (module, message, data) => {
    if (shouldLog('DEBUG')) {
      console.log(`🔧 [${module}]`, message, data !== undefined ? data : '');
    }
  },

  /**
   * Info logs - General information
   * Use for: Mock data usage, successful operations, status updates
   */
  info: (module, message, data) => {
    if (shouldLog('INFO')) {
      console.info(`ℹ️  [${module}]`, message, data !== undefined ? data : '');
    }
  },

  /**
   * Warning logs - Things that need attention but aren't errors
   * Use for: Missing icons, deprecated features, fallback usage
   */
  warn: (module, message, data) => {
    if (shouldLog('WARN')) {
      console.warn(`⚠️  [${module}]`, message, data !== undefined ? data : '');
    }
  },

  /**
   * Error logs - Always shown, even in production
   * Use for: API failures, exceptions, critical issues
   */
  error: (module, message, error) => {
    if (shouldLog('ERROR')) {
      console.error(`🔴 [${module}]`, message, error);
    }
  },

  /**
   * Mock data indicator - Special case for mock mode
   * Shows when using mock data instead of real API
   */
  mock: (module, resource, details = {}) => {
    if (shouldLog('INFO')) {
      const detailsStr = Object.keys(details).length > 0 
        ? `(${Object.entries(details).map(([k, v]) => `${k}=${v}`).join(', ')})` 
        : '';
      console.info(`🧩 [${module}:MOCK]`, `Using mock data for ${resource}`, detailsStr);
    }
  },
};

export default logger;
