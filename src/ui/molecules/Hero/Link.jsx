import { Profile } from "@/models/_index";

import { ImageLink } from "@/atoms/links/_index";

export async function HeroLink({ size, className = "" }) {
  const profile = await Profile.fetchBy({ email: process.env.PROFILE_EMAIL });

  return (
    <>
      <ImageLink
        href={profile.calendly}
        src={profile.images.me.src}
        alt="hero"
        size={size}
        className={className}
      />
    </>
  );
}
