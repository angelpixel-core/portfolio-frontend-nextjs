import prismaClient from "@/lib/prisma";

import { NextResponse, NextRequest } from "next/server";

export async function GET(request) {
  const model = prisma.socialMenuOptions;

  const socialMenuOptions = await model.findMany({
    where: {
      enabled: true,
    },
  });

  console.debug("READ socialMenuOption", socialMenuOptions);

  return NextResponse.json(socialMenuOptions);
}
