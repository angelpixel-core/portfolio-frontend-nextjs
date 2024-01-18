"use server";

import { promises as fs } from "fs";

export const fetchAcademics = async () => {
  try {
    const filename = `${process.cwd()}/src/lib/data/academics/data.json`;
    const file = await fs.readFile(filename, "utf8");
    const academics = JSON.parse(file);

    return academics;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch academics.");
  }
};
