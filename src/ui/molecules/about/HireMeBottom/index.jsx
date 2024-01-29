import "./styles.css";

import Link from "next/link";

import { fetchProfile } from "@/lib/data/_index";

export function HireMeBottom({ className }) {
  const { telegram } = fetchProfile({
    email: process.env.PROFILE_EMAIL,
  });

  return (
    <Link
      href={telegram}
      target="_blank"
      className={`${className} hire-me_about-container`}
    >
      <span className="hire-me_label text-xl font-semibold">Web Developer</span>
      <span className="hire-me_label text-2xl font-bold">Hire Me</span>
      <span className="hire-me_label text-lg">Full Stack Developer</span>
    </Link>
  );
}
