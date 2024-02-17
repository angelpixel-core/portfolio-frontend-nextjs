import { NextResponse } from "next/server";

export async function GET() {
  const data = { hello: "World" };

  console.debug({ data });

  return NextResponse.json(data);
}

const MACRO_ID = process.env.GOOGLE_SPREADSHEET_MACRO_ID;
export async function POST(request) {
  try {
    const data = await request.formData();

    const email = await data.get("email");
    const workday = await data.get("workday");
    const message = await data.get("message");

    const attachment = await data.get("attachment");
    let attachmentUrl = "";
    if (attachment) {
      attachmentUrl = await storeAttachment({ file: attachment });
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

/*
 *https://www.youtube.com/watch?v=lRU3IHG0vak
 */
async function storeAttachment({ file }) {
  // const url = await s3Store({ file });
  const url = await localStore({ file });

  return url;
}

import { writeFile } from "fs/promises";
import path from "path";

async function localStore({ file }) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filePath = path.join(
    process.cwd(),
    "scripts",
    "private",
    "uploads",
    file.name
  );

  writeFile(filePath, buffer);

  return file.name;
}

/*
import { S3Client } from "@aws-sdk/client-s3";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_ACCESS_SECRET,
  },
});
const bucketName = process.env.AWS_S3_BUCKET_NAME;

async function s3Store({ file }) {
  console.log({ fileType: typeof tile });

  if (file && typeof file === "object" && file.name) {
    const bytes = await file.arrayBuffer();

    const putParams = {
      Bucket: bucketName,
      Key: file.name,
      Body: Buffer.from(bytes),
      ContentType: file.type,
    };

    const putCommand = new PutObjectCommand(putParams);
    await s3Client.send(putCommand);

    const getParams = {
      Bucket: bucketName,
      Key: file.name,
      ACL: "private",
    };

    const getCommand = new GetObjectCommand(getParams);
    const url = await getSignedUrl(s3Client, getCommand, {
      expiresIn: 50000,
    });

    return url;
  }
}
*/
