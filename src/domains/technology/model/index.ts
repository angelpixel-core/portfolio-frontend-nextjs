import { resolveContentSource } from "@/lib/content-source";
import { logger } from "@/lib/logger";
import { TechnologiesSchema } from "./schema";

const ENDPOINT = "technologies";
const ENV_KEY = "NEXT_PUBLIC_TECHNOLOGIES";

const Technology = {
  async fetchAll({ useMockFallback: _useMockFallback = true } = {}) {
    try {
      return await resolveContentSource({
        envKey: ENV_KEY,
        schema: TechnologiesSchema,
        endpoint: ENDPOINT,
      });
    } catch (error) {
      logger.error("Technology", "fetchAll failed", error);
      throw error;
    }
  },
};

export default Technology;

// Re-export schema types
export {
  TechnologySchema,
  TechnologiesSchema,
  type TechnologyModel,
  type TechnologiesModel,
} from "./schema";
