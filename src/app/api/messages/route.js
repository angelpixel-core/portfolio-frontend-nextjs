// import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET() {
  const data = { hello: "World" };

  console.debug({ data });

  return NextResponse.json(data);
}

import { writeFile } from "fs/promises";
import path from "path";

const MACRO_ID = process.env.GOOGLE_SPREADSHEET_MACRO_ID;
export async function POST(request) {
  try {
    const data = await request.formData();

    const email = await data.get("email");
    const workday = await data.get("workday");
    const message = await data.get("message");

    const attachmentUrl = "";
    const attachment = await data.get("attachment");
    if (attachment) {
      const bytes = await attachment.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filePath = path.join(
        process.cwd(),
        "scripts",
        "private",
        "uploads",
        attachment.name
      );

      writeFile(filePath, buffer);
    }

    await fetch(`https://script.google.com/macros/s/${MACRO_ID}/exec`, {
      method: "POST",
      body: [
        `uuid=${crypto.randomUUID()}`,
        `email=${email}`,
        `workday=${workday}`,
        `message=${message}`,
        `attachment=${attachmentUrl}`,
        `state=pending`,
        `created_at=${new Date().toISOString()}`,
      ].join("&"),
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
    })
      .then((res) => {
        if (res) return res;
        else throw new Error("Failed to submit the form");
      })
      .catch((err) => {
        throw new Error(err.message);
      });

    return NextResponse.json(
      JSON.stringify({
        headers: { "Content-Type": "application/json" },
      }),
      { status: 201 }
    );
  } catch (e) {
    console.error(e.message);

    return NextResponse.json(
      {
        message: e.message,
      },
      {
        status: 400,
      }
    );
  }
}
