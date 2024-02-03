import { fetchSocials } from "@/lib/data/_index";

import { SocialLink } from "@/atoms/links/_index";

export async function SocialLinks() {
  const socials = await fetchSocials().map(({ href, name, styles }, index) => (
    <SocialLink
      key={index}
      href={href}
      iconName={name}
      iconClassName={styles}
    />
  ));

  return <>{socials}</>;
}
