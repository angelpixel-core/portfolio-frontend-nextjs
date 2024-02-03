import "./styles.css";

import { asyncFetchProfile } from "@/lib/data/_index";

import Link from "next/link";

export default async function CopyLink() {
  const { email } = await asyncFetchProfile({
    email: process.env.PROFILE_EMAIL,
  });

  return (
    <Link id="emailTextId" href={email} target="_blank" className="email_link">
      {email}
    </Link>
  );
}
