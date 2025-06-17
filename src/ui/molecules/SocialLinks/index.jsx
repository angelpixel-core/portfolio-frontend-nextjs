import { Social } from "@/models/_index";
import { SocialLink } from "@/atoms/links/_index";

export async function SocialLinks() {
  const socials = await Social.all();

  return (
    <>
      {socials.map(({ href, name, styles }, idx) => (
        <SocialLink
          key={idx}
          href={href}
          iconName={name}
          iconClassName={styles}
        />
      ))}
    </>
  );
}
