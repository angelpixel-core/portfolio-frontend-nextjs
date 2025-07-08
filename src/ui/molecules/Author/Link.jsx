import "./styles.css";

import { Profile } from "@/models";

import { default as NextLink } from "next/link";

const Link = async () => {
  const profile = await Profile.findBy({ id: 1 });

  return (
    <NextLink href={profile.github} target="_blank" className="author-link">
      {profile.brand}
    </NextLink>
  );
};

export default Link;
