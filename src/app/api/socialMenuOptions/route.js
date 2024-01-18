import { sql } from "@vercel/postgres";

import { NextResponse, NextRequest } from "next/server";

export async function GET(request) {
  const data = [];

  console.debug("READ socialMenuOption", data);

  return NextResponse.json(data);
}
