import "./styles.css";

import Link from "next/link";

const email = process.env.PROFILE_EMAIL;

export default async function CopyLink() {
  return (
    <Link id="emailTextId" href={email} target="_blank" className="email_link">
      {email}
    </Link>
  );
}
