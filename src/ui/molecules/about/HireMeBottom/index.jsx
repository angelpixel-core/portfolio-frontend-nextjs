import "./styles.css";

import Link from "next/link";

export function HireMeBottom() {
  const profile = { telegram: "https:/t.me/angelszymczak" };

  return (
    <Link
      href={profile.telegram}
      target="_blank"
      className="hire-me_about-container bg-dark dark:bg-light hover:bg-light hover:dark:bg-dark text-light dark:text-dark hover:dark:text-light hover:border-dark dark:hover:border-light hover:text-dark"
    >
      <span class="hire-me_label text-xl font-semibold">Web Developer</span>
      <span class="hire-me_label text-2xl font-bold">Hire Me</span>
      <span class="hire-me_label text-lg">Full Stack Developer</span>
    </Link>
  );
}
