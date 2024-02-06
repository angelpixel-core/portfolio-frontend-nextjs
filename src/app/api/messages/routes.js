// import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  const data = [];

  console.debug("READ", request);

  return NextResponse.json(data);
}
