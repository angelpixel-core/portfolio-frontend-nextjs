// import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET() {
  const data = { hello: "World" };

  console.debug({ data });

  return NextResponse.json(data);
}

export async function POST(req) {
  const body = await req.json();

  return NextResponse.json({ data: { ...body, status: "ok" } });
}
