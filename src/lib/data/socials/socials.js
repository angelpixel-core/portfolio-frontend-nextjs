import prismaClient from "@/lib/prisma";

import {
  // BehanceIcon,
  TwitterIcon,
  LinkedInIcon,
  GithubIcon,
  DribbbleIcon,
  PinterestIcon,
} from "@/atoms/icons/_index";

const iconsMap = {
  // "BehanceIcon": BehanceIcon,
  TwitterIcon: TwitterIcon,
  LinkedInIcon: LinkedInIcon,
  GithubIcon: GithubIcon,
  DribbbleIcon: DribbbleIcon,
  PinterestIcon: PinterestIcon,
};

export const fetchSocials = async () => {
  try {
    const model = prisma.socialMenuOptions;

    const socialMenuOptions = await model.findMany({
      where: {
        enabled: true,
      },
    });

    return socialMenuOptions;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch socials.");
  }
};
