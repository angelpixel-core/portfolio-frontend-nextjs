import type { z } from "zod";
import httpRequest from "@/lib/httpRequest";
import environmentContentRegistry, {
  type EnvironmentContentKey,
} from "@/environment-content";

export type ContentSourceEnv =
  | { kind: "inline"; value: string }
  | { kind: "file"; fileName: string };

export interface ContentSourceOptions<T> {
  envKey: string;
  schema: z.ZodSchema<T>;
  endpoint: string;
  parseJson?: boolean;
}

export type ContentSourceResult<T> = Promise<T>;

const FILE_PREFIX = "file:";

const normalizeEnvValue = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const assertValidFileName = (fileName: string): void => {
  if (!fileName) {
    throw new Error("Environment content file reference is empty");
  }

  if (
    fileName.includes("/") ||
    fileName.includes("\\") ||
    fileName.includes("..")
  ) {
    throw new Error(
      `Environment content file reference is invalid: ${fileName}`
    );
  }
};

const parseEnvReference = (value: string): ContentSourceEnv => {
  if (value.startsWith(FILE_PREFIX)) {
    const fileName = value.slice(FILE_PREFIX.length).trim();
    assertValidFileName(fileName);
    return { kind: "file", fileName };
  }

  return { kind: "inline", value };
};

const parseInlineValue = (value: string, parseJson: boolean): unknown => {
  if (!parseJson) {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to parse inline JSON: ${message}`);
  }
};

const isEnvironmentContentKey = (
  value: string
): value is EnvironmentContentKey => {
  return Object.prototype.hasOwnProperty.call(
    environmentContentRegistry,
    value
  );
};

const loadFileContent = (fileName: string): unknown => {
  if (!isEnvironmentContentKey(fileName)) {
    throw new Error(`Environment content file not found: ${fileName}`);
  }

  return environmentContentRegistry[fileName];
};

const resolveEnvContent = (value: string, parseJson: boolean): unknown => {
  const reference = parseEnvReference(value);

  if (reference.kind === "file") {
    return loadFileContent(reference.fileName);
  }

  return parseInlineValue(reference.value, parseJson);
};

export async function resolveContentSource<T>(
  options: ContentSourceOptions<T>
): ContentSourceResult<T> {
  const { envKey, schema, endpoint, parseJson = true } = options;
  const envValue = normalizeEnvValue(process.env[envKey]);

  if (envValue) {
    const resolved = resolveEnvContent(envValue, parseJson);
    return schema.parse(resolved);
  }

  const data = await httpRequest(endpoint);
  return schema.parse(data);
}

export function resolveEnvContentSource<T>(
  options: Omit<ContentSourceOptions<T>, "endpoint">
): T | undefined {
  const { envKey, schema, parseJson = true } = options;
  const envValue = normalizeEnvValue(process.env[envKey]);

  if (!envValue) {
    return undefined;
  }

  const resolved = resolveEnvContent(envValue, parseJson);
  return schema.parse(resolved);
}
