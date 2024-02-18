"use server";
import fs from "fs";
import path from "path";

const filePath = (resourceName) => {
  return path.join(
    process.cwd(),
    process.env.SOURCE_DATA_PATH,
    `${resourceName}.json`
  );
};

const ENCODING = "utf-8";
const jsonFile = async (jsonFileName) => {
  const jsonFilePath = filePath(jsonFileName);

  return await fs.readFileSync(jsonFilePath, ENCODING);
};

const jsonData = async (resourceJsonFileName) => {
  const file = await jsonFile(resourceJsonFileName);

  return await JSON.parse(file);
};

export { jsonData };
