"use client";

import "./styles.css";

import Link from "next/link";
import { useProfile } from "@/domains/profile/queries";

interface HireMeButtonProps {
  className?: string;
}

const HireMeButton = ({ className }: HireMeButtonProps) => {
  const { data: profile, isLoading, isError } = useProfile(1);

  if (isLoading) {
    return (
      <div className={`${className} hire-me__about-container focus-ring`}>
        <span className="hire-me__label text-lg">Loading...</span>
      </div>
    );
  }

  if (isError || !profile?.telegram) {
    return (
      <div className={`${className} hire-me__about-container focus-ring`}>
        <span className="hire-me__label text-lg">Contact unavailable</span>
      </div>
    );
  }

  return (
    <Link
      href={profile.telegram}
      target="_blank"
      className={`${className} hire-me__about-container focus-ring`}
    >
      <span className="hire-me__label text-2xl font-bold font-orbitron">
        Let's talk →
      </span>
    </Link>
  );
};

export default HireMeButton;
