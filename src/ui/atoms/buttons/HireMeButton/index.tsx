"use client";

import "./styles.css";

import Link from "next/link";
import { useProfile } from "@/hooks";

interface HireMeButtonProps {
  className?: string;
}

const HireMeButton = ({ className }: HireMeButtonProps) => {
  const { data: profile, isLoading, isError } = useProfile(1);

  if (isLoading) {
    return (
      <div className={`${className} hire-me_about-container focus-ring`}>
        <span className="hire-me_label text-lg">Loading...</span>
      </div>
    );
  }

  if (isError || !profile?.telegram) {
    return (
      <div className={`${className} hire-me_about-container focus-ring`}>
        <span className="hire-me_label text-lg">Contact unavailable</span>
      </div>
    );
  }

  return (
    <Link
      href={profile.telegram}
      target="_blank"
      className={`${className} hire-me_about-container focus-ring`}
    >
      <span className="hire-me_label text-xl font-semibold">Web Developer</span>
      <span className="hire-me_label text-2xl font-bold">Hire Me</span>
      <span className="hire-me_label text-lg">Full Stack Developer</span>
    </Link>
  );
};

export default HireMeButton;
