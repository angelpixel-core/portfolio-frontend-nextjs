import { sql } from "@vercel/postgres";

import { NextResponse, NextRequest } from "next/server";

export async function GET(request) {
  const data = [
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
  ];

  console.debug("PUT socialMenuOption", data);

  return NextResponse.json({ message: "Seed Executed" });
}
