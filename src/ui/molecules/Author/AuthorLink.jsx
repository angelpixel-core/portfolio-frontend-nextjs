import "./styles.css";

import { Profile } from "@/models";

import Link from "next/link";

const email = process.env.PROFILE_EMAIL;

export default async function AuthorLink() {
  const { brand, github } = await Profile.fetchBy({ email }).then(
    (profile) => ({
      brand: profile.brand,
      github: profile.github,
    })
  );

  return (
    <Link href={github} target="_blank" className="author-link">
      {brand}
    </Link>
  );
}
