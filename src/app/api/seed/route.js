import prismaClient from "@/lib/prisma";

import { NextResponse, NextRequest } from "next/server";

export async function GET(request) {
  const model = prisma.socialMenu;

  await model.deleteMany();

  const socialMenuOption = await model.createMany({
    data: [
      {
        menuOption: "twitter",
        href: "https://twitter.com",
        iconComponentName: "TwitterIcon",
      },
      {
        menuOption: "linkedin",
        href: "https://linkedin.com",
        iconComponentName: "LinkedInIcon",
      },
      {
        menuOption: "github",
        href: "https://github.com",
        iconComponentName: "GithubIcon",
        iconClassName: "bg-light dark:bg-dark rounded-full",
      },
      {
        menuOption: "dribbble",
        href: "https://dribbble.com",
        iconComponentName: "DribbbleIcon",
      },
      {
        menuOption: "pinterest",
        href: "https://pinterest.com",
        iconComponentName: "PinterestIcon",
        iconClassName: "bg-light",
      },
      {
        menuOption: "linkedin",
        href: "https://linkedin.com",
        iconComponentName: "LinkedInIcon",
      },
    ],
  });

  console.log("socialMenuOption", socialMenuOption);

  return NextResponse.json({ message: "Seed Executed" });
}
