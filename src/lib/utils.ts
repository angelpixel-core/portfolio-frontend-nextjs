"use server";

import fs from "fs";
import path from "path";
import { logger } from "@/lib/logger";

const PATH = process.env.SOURCE_DATA_PATH;
const ENCODING = "utf-8" as const;

const filePath = (file: string): string =>
  path.join(process.cwd(), PATH ?? "", `${file}.json`);

const file = async (name: string): Promise<string> =>
  await fs.readFileSync(filePath(name), ENCODING);

const jsonData = async (src: string): Promise<unknown> =>
  await file(src).then((raw) => JSON.parse(raw));

const tryQuery = async <T>(query: () => Promise<T>): Promise<T | undefined> => {
  try {
    return await query();
  } catch (error) {
    logger.error("Database", "Query failed", error);
    return undefined;
  }
};

export { jsonData, tryQuery };
