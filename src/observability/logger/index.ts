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
  debug: (module: string, message: string, data?: unknown): void => {
    if (shouldLog("DEBUG")) {
      console.log(`🔧 [${module}]`, message, data !== undefined ? data : "");
    }
  },

  info: (module: string, message: string, data?: unknown): void => {
    if (shouldLog("INFO")) {
      console.info(`ℹ️  [${module}]`, message, data !== undefined ? data : "");
    }
  },

  warn: (module: string, message: string, data?: unknown): void => {
    if (shouldLog("WARN")) {
      console.warn(`⚠️  [${module}]`, message, data !== undefined ? data : "");
    }
  },

  error: (module: string, message: string, error?: unknown): void => {
    if (shouldLog("ERROR")) {
      console.error(`🔴 [${module}]`, message, error);
    }
  },

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
