"use server";

import fs from "fs";
import path from "path";

const PATH = process.env.SOURCE_DATA_PATH;
const ENCODING = "utf-8";

const filePath = (file) => path.join(process.cwd(), PATH, `${file}.json`);

const file = async (name) => await fs.readFileSync(filePath(name), ENCODING);

const jsonData = async (src) => await file(src).then((raw) => JSON.parse(raw));

const tryQuery = async (query) => {
  try {
    return await query();
  } catch (error) {
    console.error("Database Error:", error.message);
  }
};

export { jsonData, tryQuery };
