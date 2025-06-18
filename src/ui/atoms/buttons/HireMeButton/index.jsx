import "./styles.css";

import Link from "next/link";
import { Profile } from "@/models";

export async function HireMeButton({ className }) {
  const profile = await Profile.fetchBy({ email: process.env.PROFILE_EMAIL });

  return (
    <Link
      href={profile.telegram}
      target="_blank"
      className={`${className} hire-me_about-container`}
    >
      <span className="hire-me_label text-xl font-semibold">Web Developer</span>
      <span className="hire-me_label text-2xl font-bold">Hire Me</span>
      <span className="hire-me_label text-lg">Full Stack Developer</span>
    </Link>
  );
}
