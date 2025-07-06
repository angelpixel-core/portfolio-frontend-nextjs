import "./styles.css";

import { Profile } from "@/models";

import { default as NextLink } from "next/link";

const email = process.env.PROFILE_EMAIL;

const Link = async () => {
  const { brand, github } = await Profile.fetchBy({ email }).then(
    (profile) => ({
      brand: profile.brand,
      github: profile.github,
    })
  );

  return (
    <NextLink href={github} target="_blank" className="author-link">
      {brand}
    </NextLink>
  );
};

export default Link;
