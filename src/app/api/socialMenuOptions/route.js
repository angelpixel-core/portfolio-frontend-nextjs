// import { sql } from "@vercel/postgres";

// import { NextResponse, NextRequest } from "next/server";
import { NextResponse } from "next/server";

// export async function GET(request) {
export async function GET() {
  const data = [];

  console.debug("READ socialMenuOption", data);

  return NextResponse.json(data);
}
