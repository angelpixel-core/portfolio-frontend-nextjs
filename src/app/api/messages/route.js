// import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET() {
  const data = { hello: "World" };

  console.debug({ data });

  return NextResponse.json(data);
}

// import fs from "fs";
// import path from "path";

export async function POST(req, context) {
  console.log({ context });
  const { body } = context;
  // const body = await req.body();
  console.log({ body });
  // const { file, data } = await req.body();
  // console.log({ file, data });
  //
  // const body = await req.json();

  return NextResponse.json({ status: "ok" });
}
