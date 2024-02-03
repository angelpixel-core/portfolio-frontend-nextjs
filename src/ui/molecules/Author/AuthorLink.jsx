import "./styles.css";

import { asyncFetchProfile } from "@/lib/data/_index";

import Link from "next/link";

export default async function AuthorLink() {
  const { brand, github } = await asyncFetchProfile({
    email: process.env.PROFILE_EMAIL,
  });

  return (
    <Link href={github} target="_blank" className="author-link">
      {brand}
    </Link>
  );
}
