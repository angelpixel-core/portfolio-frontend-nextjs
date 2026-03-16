import contents from "./contents.json";
import profiles from "./profiles.json";
import navigationItems from "./navigation-items.json";
import customers from "./customers.json";
import technologies from "./technologies.json";
import wordCloudConcepts from "./word-cloud-concepts.json";

const environmentContentRegistry = {
  "contents.json": contents,
  "profiles.json": profiles,
  "navigation-items.json": navigationItems,
  "customers.json": customers,
  "technologies.json": technologies,
  "word-cloud-concepts.json": wordCloudConcepts,
} as const;

export type EnvironmentContentKey = keyof typeof environmentContentRegistry;

export const getEnvironmentContent = (
  fileName: EnvironmentContentKey
): (typeof environmentContentRegistry)[EnvironmentContentKey] => {
  return environmentContentRegistry[fileName];
};

export default environmentContentRegistry;
