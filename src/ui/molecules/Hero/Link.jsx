import { Asset, Profile } from "@/models/_index";

import { ImageLink } from "@/atoms/links/_index";

export async function HeroLink({ name, size, className = "" }) {
  const profile = await Profile.findBy({ email: process.env.PROFILE_EMAIL });
  const image = await Asset.findBy({ name });

  return (
    <ImageLink
      href={profile.calendly}
      src={image.src}
      alt={image.alt}
      size={size}
      className={className}
    />
  );
}
